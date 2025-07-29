import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { client } from "../../tina/__generated__/client";

export const loader: LoaderFunction = async ({ params }) => {
  const lang = params.lang || "en";
  
  if (!["en", "vi"].includes(lang)) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const journalList = await client.queries.journalConnection({
      filter: {
        published: {
          eq: true
        }
      }
    });
    return { 
      journals: journalList.data.journalConnection.edges || [], 
      lang 
    };
  } catch (error) {
    console.error("Error fetching journals:", error);
    return { journals: [], lang };
  }
};

export default function JournalIndex() {
  const { journals, lang } = useLoaderData<typeof loader>();

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
                <a href={`/${lang}/journal`} className="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Journal" : "Nhật ký"}
                </a>
                <a href={`/${lang}/testimonials`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Kind Words" : "Lời cảm ơn"}
                </a>
                <a href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Blog" : "Blog"}
                </a>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <a href={`/en/journal`} className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href={`/vi/journal`} className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
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
            {lang === "en" ? "Wedding Journal" : "Nhật ký cưới"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {lang === "en" 
              ? "Explore our collection of beautiful weddings and love stories"
              : "Khám phá bộ sưu tập những đám cưới đẹp và câu chuyện tình yêu"
            }
          </p>
        </div>
      </section>

      {/* Journal Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {journals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {journals.map((journal: any, index: number) => (
                <div key={index} className="group cursor-pointer">
                  <a href={`/${lang}/journal/${journal.node.slug}`}>
                    <div className="aspect-w-4 aspect-h-3 mb-4 overflow-hidden rounded-lg">
                      {journal.node.featured_image && (
                        <img 
                          src={journal.node.featured_image} 
                          alt={lang === "en" ? journal.node.subtitle_en : journal.node.subtitle_vi}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {lang === "en" ? journal.node.subtitle_en : journal.node.subtitle_vi}
                      </h3>
                      <p className="text-gray-600">
                        {journal.node.couple_names}
                      </p>
                      {journal.node.wedding_details?.wedding_date && (
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(journal.node.wedding_details.wedding_date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN")}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {lang === "en" 
                  ? "No wedding journals available yet. Check back soon!"
                  : "Chưa có nhật ký cưới nào. Hãy quay lại sau!"
                }
              </p>
            </div>
          )}
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