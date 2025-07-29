import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { client } from "../../tina/__generated__/client";

export const loader: LoaderFunction = async ({ params }) => {
  const lang = params.lang || "en";
  
  if (!["en", "vi"].includes(lang)) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const blogList = await client.queries.blogConnection();
    return { 
      blogs: blogList.data.blogConnection.edges || [], 
      lang 
    };
  } catch (error) {
    return { blogs: [], lang };
  }
};

export default function BlogIndex() {
  const { blogs, lang } = useLoaderData<typeof loader>();

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
              <a href={`/en/blog`} className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href={`/vi/blog`} className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                VI
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            {lang === "en" ? "Blog" : "Blog"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {lang === "en" 
              ? "Wedding planning tips, inspiration, and behind-the-scenes stories"
              : "Mẹo lên kế hoạch đám cưới, cảm hứng và những câu chuyện hậu trường"
            }
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any, index: number) => (
                <article key={index} className="group">
                  <a href={`/${lang}/blog/${blog.node.slug}`}>
                    {/* Featured Image */}
                    {blog.node.featured_image && (
                      <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={blog.node.featured_image} 
                          alt={lang === "en" ? blog.node.title_en : blog.node.title_vi}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="space-y-3">
                      {/* Categories */}
                      {blog.node.categories && blog.node.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.node.categories.map((category: string, catIndex: number) => (
                            <span 
                              key={catIndex} 
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                        {lang === "en" ? blog.node.title_en : blog.node.title_vi}
                      </h2>

                      {/* Excerpt */}
                      {(lang === "en" ? blog.node.excerpt_en : blog.node.excerpt_vi) && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {lang === "en" ? blog.node.excerpt_en : blog.node.excerpt_vi}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {blog.node.published_date && (
                          <time dateTime={blog.node.published_date}>
                            {new Date(blog.node.published_date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                        <span className="group-hover:text-gray-700 transition-colors">
                          {lang === "en" ? "Read more →" : "Đọc thêm →"}
                        </span>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {lang === "en" 
                  ? "No blog posts available yet. Check back soon!"
                  : "Chưa có bài viết blog nào. Hãy quay lại sau!"
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === "en" ? "Stay Updated" : "Cập nhật thông tin"}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === "en" 
              ? "Subscribe to get the latest wedding tips and inspiration"
              : "Đăng ký để nhận những mẹo và cảm hứng cưới mới nhất"
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