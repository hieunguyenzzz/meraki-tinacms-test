import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export const loader: LoaderFunction = async ({ params }) => {
  const lang = params.lang || "en";
  
  if (!["en", "vi"].includes(lang)) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const testimonialList = await client.queries.testimonialConnection();
    return { 
      testimonials: testimonialList.data.testimonialConnection.edges || [], 
      lang 
    };
  } catch (error) {
    return { testimonials: [], lang };
  }
};

export default function TestimonialsIndex() {
  const { testimonials, lang } = useLoaderData<typeof loader>();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

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
                <a href={`/${lang}/testimonials`} className="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Kind Words" : "Lời cảm ơn"}
                </a>
                <a href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Blog" : "Blog"}
                </a>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <a href={`/en/testimonials`} className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href={`/vi/testimonials`} className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
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
            {lang === "en" ? "Kind Words" : "Lời cảm ơn"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {lang === "en" 
              ? "What our couples say about their special day with us"
              : "Những lời chia sẻ của các cặp đôi về ngày đặc biệt cùng chúng tôi"
            }
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                  {/* Client Photo */}
                  {testimonial.node.client_photo && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={testimonial.node.client_photo} 
                        alt={testimonial.node.client_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.node.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <div className="text-gray-700 mb-4 text-center">
                    <TinaMarkdown 
                      content={lang === "en" ? testimonial.node.testimonial_en : testimonial.node.testimonial_vi} 
                    />
                  </div>

                  {/* Client Info */}
                  <div className="text-center">
                    <p className="font-medium text-gray-900 mb-1">
                      {testimonial.node.client_name}
                    </p>
                    {testimonial.node.wedding_date && (
                      <p className="text-sm text-gray-500">
                        {new Date(testimonial.node.wedding_date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {lang === "en" 
                  ? "No testimonials available yet. Check back soon!"
                  : "Chưa có lời cảm ơn nào. Hãy quay lại sau!"
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === "en" ? "Ready to Create Your Own Love Story?" : "Sẵn sàng tạo nên câu chuyện tình yêu của riêng bạn?"}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === "en" 
              ? "Let us help you plan the wedding of your dreams"
              : "Hãy để chúng tôi giúp bạn lên kế hoạch cho đám cưới trong mơ"
            }
          </p>
          <div className="space-x-4">
            <a 
              href={`/${lang}/journal`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === "en" ? "View Our Work" : "Xem tác phẩm"}
            </a>
            <a 
              href={`/${lang}/about`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              {lang === "en" ? "Get In Touch" : "Liên hệ"}
            </a>
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