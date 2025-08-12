import { client } from './tina/__generated__/client.ts';

async function testBlogQuery() {
  try {
    const result = await client.queries.blog({
      relativePath: 'wedding-planning-tips.mdx',
    });
    
    console.log('Blog post data structure:');
    console.log(JSON.stringify(result.data.blog, null, 2));
  } catch (error) {
    console.error('Error fetching blog post:', error);
  }
}

testBlogQuery();
