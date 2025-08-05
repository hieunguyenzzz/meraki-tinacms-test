import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const loader: LoaderFunction = async ({ params }) => {
  const lang = params.lang || "en";
  const slug = params.slug;
  
  if (!["en", "vi"].includes(lang) || !slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const blog = await client.queries.blog({ 
      relativePath: `${slug}.mdx` 
    });
    return { 
      blog: blog.data.blog, 
      lang 
    };
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function BlogDetail() {
  const { blog, lang } = useLoaderData<typeof loader>();

  const title = lang === "en" ? blog.title_en : blog.title_vi;
  const content = lang === "en" ? blog.content_en : blog.content_vi;
  const excerpt = lang === "en" ? blog.excerpt_en : blog.excerpt_vi;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <a href={`/${lang}`} className="text-2xl font-bold text-gray-900">Meraki</a>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href={`/${lang}`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Home" : "Trang chủ"}
                </a>
                <a href={`/${lang}/about`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "About" : "Giới thiệu"}
                </a>
                <a href={`/${lang}/journal`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Journal" : "Nhật ký"}
                </a>
                <a href={`/${lang}/testimonials`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Kind Words" : "Lời cảm ơn"}
                </a>
                <a href={`/${lang}/blog`} className="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Blog" : "Blog"}
                </a>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <a href={`/en/blog/${blog.slug}`} className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href={`/vi/blog/${blog.slug}`} className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                VI
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href={`/${lang}`} className="text-gray-500 hover:text-gray-700">
                  {lang === "en" ? "Home" : "Trang chủ"}
                </a>
              </li>
              <li>
                <span className="text-gray-500 mx-2">/</span>
                <a href={`/${lang}/blog`} className="text-gray-500 hover:text-gray-700">
                  {lang === "en" ? "Blog" : "Blog"}
                </a>
              </li>
              <li>
                <span className="text-gray-500 mx-2">/</span>
                <span className="text-gray-900">{title}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header */}
          <header className="mb-12">
            {blog.categories && blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((category: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl font-light text-gray-900 mb-4">{title}</h1>
            
            {excerpt && (
              <p className="text-xl text-gray-600 mb-6">{excerpt}</p>
            )}
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              {blog.published_date && (
                <time 
                  dateTime={blog.published_date}
                  className="text-gray-500"
                >
                  {new Date(blog.published_date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="mb-12">
              <img 
                src={blog.featured_image} 
                alt={title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          {content && (
            <div className="prose prose-lg max-w-none mb-12">
              <TinaMarkdown content={content} />
            </div>
          )}

          {/* Social Sharing */}
          <div className="border-t border-gray-200 pt-8 mb-12">
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      url: window.location.href,
                    });
                  }
                }}
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                {lang === "en" ? "Share" : "Chia sẻ"}
              </button>
              <a 
                href={`/${lang}/blog`}
                className="border border-gray-900 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
              >
                {lang === "en" ? "Back to Blog" : "Quay lại Blog"}
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === "en" ? "Enjoyed this article?" : "Thích bài viết này?"}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === "en" 
              ? "Subscribe to get more wedding planning tips and inspiration"
              : "Đăng ký để nhận thêm mẹo lên kế hoạch cưới và cảm hứng"
            }
          </p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder={lang === "en" ? "Enter your email" : "Nhập email của bạn"}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-r-md hover:bg-gray-800 transition-colors">
              {lang === "en" ? "Subscribe" : "Đăng ký"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Meraki</h3>
              <p className="text-gray-400">
                {lang === "en" 
                  ? "Creating beautiful weddings with love and passion"
                  : "Tạo nên những đám cưới đẹp với tình yêu và đam mê"
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">
                {lang === "en" ? "Services" : "Dịch vụ"}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>{lang === "en" ? "Wedding Planning" : "Tổ chức tiệc cưới"}</li>
                <li>{lang === "en" ? "Event Coordination" : "Điều phối sự kiện"}</li>
                <li>{lang === "en" ? "Venue Selection" : "Chọn địa điểm"}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">
                {lang === "en" ? "Quick Links" : "Liên kết nhanh"}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href={`/${lang}/about`} className="hover:text-white">{lang === "en" ? "About" : "Giới thiệu"}</a></li>
                <li><a href={`/${lang}/journal`} className="hover:text-white">{lang === "en" ? "Portfolio" : "Danh mục"}</a></li>
                <li><a href={`/${lang}/testimonials`} className="hover:text-white">{lang === "en" ? "Testimonials" : "Lời cảm ơn"}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">
                {lang === "en" ? "Contact" : "Liên hệ"}
              </h4>
              <p className="text-gray-400 text-sm">
                Email: hello@meraki-wedding.com<br/>
                Phone: +84 123 456 789
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Meraki Wedding Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}