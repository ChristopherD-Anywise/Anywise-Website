import { commitTree, type FileEntry } from './github-tree';
import type { Env } from './index';

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  publishDate: string;
  readTime: number;
  heroImage: string;
  content: string;
  _attachmentId?: string; /* Tracks which ClickUp attachment is the hero image — enables diff-based skip */
}

interface ClickUpTask {
  id: string;
  name: string;
  description: string;
  tags: Array<{ name: string }>;
  attachments?: Array<{
    id: string;
    title: string;
    extension: string;
    url: string;
  }>;
  custom_fields: Array<{
    id: string;
    name: string;
    type: string;
    value?: unknown;
    type_config?: {
      options?: Array<{ id: string; name?: string; orderindex: number }>;
    };
  }>;
}

function getCustomFieldValue(task: ClickUpTask, fieldName: string): string {
  const field = task.custom_fields.find(
    f => f.name.toLowerCase() === fieldName.toLowerCase()
  );
  if (!field || field.value === undefined || field.value === null) return '';

  /* ClickUp dropdown value can be a numeric orderindex OR a UUID string — handle both
     (see careers-api sync-jobs.ts for the same pattern, learned from c51957e fix) */
  if (field.type === 'drop_down' && field.type_config?.options) {
    const val = field.value;
    const option = typeof val === 'string'
      ? field.type_config.options.find(o => o.id === val)
      : field.type_config.options.find(o => o.orderindex === val);
    return option?.name || '';
  }

  if (field.type === 'date' && field.value) {
    const ts = Number(field.value);
    if (!isNaN(ts)) {
      const d = new Date(ts + 12 * 60 * 60 * 1000);
      return d.toISOString().split('T')[0];
    }
  }

  return String(field.value);
}

function getHeroAttachment(task: ClickUpTask): { id: string; url: string; ext: string } | null {
  if (!task.attachments) return null;
  const imageExts = ['jpg', 'jpeg', 'png', 'webp'];
  const img = task.attachments.find(a => imageExts.includes(a.extension.toLowerCase()));
  if (!img) return null;
  return { id: img.id, url: img.url, ext: img.extension.toLowerCase() };
}

export function taskToPost(task: ClickUpTask): BlogPost {
  const slug = getCustomFieldValue(task, 'Slug') || task.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const content = task.description || '';
  /* Strip markdown syntax before counting words to avoid inflated read times */
  const plainText = content
    .replace(/#{1,6}\s/g, '')           /* headings */
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') /* links */
    .replace(/[*_~`>-]/g, '')           /* emphasis, quotes, list markers */
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ''); /* images */
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: task.name,
    author: getCustomFieldValue(task, 'Author') || 'Anywise Team',
    category: getCustomFieldValue(task, 'Category') || 'News',
    tags: (task.tags || []).map(t => t.name),
    excerpt: getCustomFieldValue(task, 'Excerpt') || '',
    publishDate: getCustomFieldValue(task, 'Publish Date') || '',
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
    heroImage: '',
    content,
  };
}

export async function handleSyncPosts(
  request: Request,
  env: Env,
): Promise<Response> {
  // Authenticate webhook
  const secret =
    request.headers.get('X-Webhook-Secret') ||
    request.headers.get('Authorization');
  if (!secret || secret !== env.WEBHOOK_SECRET) {
    return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Fetch published tasks
  const clickupUrl =
    `https://api.clickup.com/api/v2/list/${env.CLICKUP_BLOG_LIST_ID}/task` +
    `?statuses[]=published&include_closed=false&subtasks=false&include_custom_fields=true`;

  const clickupResp = await fetch(clickupUrl, {
    headers: {
      Authorization: env.CLICKUP_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!clickupResp.ok) {
    const errText = await clickupResp.text();
    console.error('ClickUp API error:', errText);
    return Response.json(
      { success: false, message: `ClickUp API error: ${clickupResp.status}` },
      { status: 502 },
    );
  }

  const data = (await clickupResp.json()) as { tasks: ClickUpTask[] };

  // Transform tasks to posts
  const posts: BlogPost[] = [];
  const imageFiles: FileEntry[] = [];

  for (const task of data.tasks) {
    try {
      const post = taskToPost(task);

      /* The list endpoint does NOT include attachments. Fetch per-task detail
         to get attachments with fresh signed URLs (ClickUp signed URLs expire). */
      try {
        const taskDetailResp = await fetch(
          `https://api.clickup.com/api/v2/task/${task.id}?include_custom_fields=true`,
          { headers: { Authorization: env.CLICKUP_API_KEY, 'Content-Type': 'application/json' } },
        );
        if (taskDetailResp.ok) {
          const taskDetail = (await taskDetailResp.json()) as ClickUpTask;
          const hero = getHeroAttachment(taskDetail);

          if (hero) {
            const imagePath = `assets/images/blog/${post.slug}.${hero.ext}`;
            post.heroImage = `../${imagePath}`;
            post._attachmentId = hero.id;

            // Download image from fresh signed URL (best-effort)
            try {
              const imgResp = await fetch(hero.url, {
                headers: { Authorization: env.CLICKUP_API_KEY },
              });
              if (imgResp.ok) {
                const imgBuffer = await imgResp.arrayBuffer();
                imageFiles.push({ path: imagePath, content: imgBuffer });
              } else {
                console.error(`Failed to download image for ${post.slug}: ${imgResp.status}`);
              }
            } catch (imgErr) {
              console.error(`Image download error for ${post.slug}:`, imgErr);
            }
          }
        } else {
          console.error(`Failed to fetch task detail for ${task.id}: ${taskDetailResp.status}`);
        }
      } catch (detailErr) {
        console.error(`Task detail fetch error for ${task.id}:`, detailErr);
      }

      posts.push(post);
    } catch (err) {
      console.error(`Failed to parse task ${task.id} (${task.name}):`, err);
    }
  }

  // Sort by publish date descending
  posts.sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  // Build files for commit
  const allFiles: FileEntry[] = [
    { path: 'blog/posts.json', content: JSON.stringify(posts, null, 2) + '\n' },
    ...imageFiles,
  ];

  // Commit to GitHub
  try {
    const result = await commitTree(
      allFiles,
      'chore: sync blog posts from ClickUp',
      env.GITHUB_TOKEN,
      env.GITHUB_REPO,
    );
    return Response.json({
      success: true,
      committed: result.committed,
      postCount: posts.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'GitHub commit failed';
    console.error('GitHub error:', message);
    return Response.json({ success: false, message }, { status: 502 });
  }
}
