import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { client } from "../../tina/__generated__/client";

export const meta: MetaFunction = ({ data }: { data: any }) => {
  const { page, lang } = data;
  const seo = lang === "en" ? page?.seo_en : page?.seo_vi;
  
  return [
    { title: seo?.title || (lang === "en" ? "Meraki Wedding Planner" : "Meraki Wedding Planner") },
    { name: "description", content: seo?.description || (lang === "en" ? "Professional wedding planning services in Vietnam" : "Dịch vụ tổ chức tiệc cưới chuyên nghiệp tại Việt Nam") },
    { property: "og:title", content: seo?.title || (lang === "en" ? "Meraki Wedding Planner" : "Meraki Wedding Planner") },
    { property: "og:description", content: seo?.description || (lang === "en" ? "Professional wedding planning services in Vietnam" : "Dịch vụ tổ chức tiệc cưới chuyên nghiệp tại Việt Nam") },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index, follow" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const lang = params.lang || "en";
  
  if (!["en", "vi"].includes(lang)) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const page = await client.queries.page({ relativePath: "index.mdx" });
    return { page: page.data.page, lang };
  } catch (error) {
    return { page: null, lang };
  }
};

export default function LangIndex() {
  const { page, lang } = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Meraki</h1>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href={`/${lang}`} className="text-gray-900 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
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
                <a href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {lang === "en" ? "Blog" : "Blog"}
                </a>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <a href="/en" className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                EN
              </a>
              <a href="/vi" className={`px-2 py-1 text-sm rounded ${lang === "vi" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                VI
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            {page && page.hero 
              ? (lang === "en" ? page.hero.title_en : page.hero.title_vi) || "Meraki Wedding Planner"
              : "Meraki Wedding Planner"
            }
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {page && page.hero 
              ? (lang === "en" ? page.hero.subtitle_en : page.hero.subtitle_vi) || 
                (lang === "en" 
                  ? "Creating unforgettable moments with love and passion" 
                  : "Tạo nên những khoảnh khắc khó quên với tình yêu và đam mê")
              : (lang === "en" 
                  ? "Creating unforgettable moments with love and passion" 
                  : "Tạo nên những khoảnh khắc khó quên với tình yêu và đam mê")
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
              {lang === "en" ? "About Us" : "Về chúng tôi"}
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === "en" ? "Our Services" : "Dịch vụ của chúng tôi"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === "en" 
                ? "We offer comprehensive wedding planning services to make your special day perfect"
                : "Chúng tôi cung cấp dịch vụ tổ chức tiệc cưới toàn diện để ngày đặc biệt của bạn trở nên hoàn hảo"
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {lang === "en" ? "Full Planning" : "Tổ chức trọn gói"}
              </h3>
              <p className="text-gray-600">
                {lang === "en" 
                  ? "Complete wedding planning from start to finish"
                  : "Tổ chức tiệc cưới hoàn chỉnh từ đầu đến cuối"
                }
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {lang === "en" ? "Partial Planning" : "Tổ chức một phần"}
              </h3>
              <p className="text-gray-600">
                {lang === "en" 
                  ? "Assistance with specific aspects of your wedding"
                  : "Hỗ trợ các khía cạnh cụ thể của đám cưới"
                }
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                {lang === "en" ? "Day Coordination" : "Điều phối ngày cưới"}
              </h3>
              <p className="text-gray-600">
                {lang === "en" 
                  ? "Ensuring everything runs smoothly on your wedding day"
                  : "Đảm bảo mọi thứ diễn ra suôn sẻ trong ngày cưới"
                }
              </p>
            </div>
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