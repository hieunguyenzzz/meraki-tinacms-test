import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'en' ? 'Our Services - Meraki Wedding Planner' : 'Dịch vụ của chúng tôi - Meraki Wedding Planner',
    description: lang === 'en' 
      ? 'Comprehensive wedding planning services to make your special day perfect'
      : 'Dịch vụ tổ chức tiệc cưới toàn diện để ngày đặc biệt của bạn trở nên hoàn hảo',
  };
}

export default function ServicePage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const services = [
    {
      title: { en: 'Full Wedding Planning', vi: 'Tổ chức tiệc cưới trọn gói' },
      description: { 
        en: 'Complete wedding planning from initial concept to final execution. We handle every detail so you can enjoy your engagement period stress-free.',
        vi: 'Tổ chức tiệc cưới hoàn chỉnh từ ý tưởng ban đầu đến thực hiện cuối cùng. Chúng tôi xử lý mọi chi tiết để bạn có thể tận hưởng thời gian đính hôn mà không lo lắng.'
      },
      features: {
        en: ['Timeline creation', 'Vendor management', 'Budget planning', 'Day-of coordination'],
        vi: ['Lập kế hoạch thời gian', 'Quản lý nhà cung cấp', 'Lập kế hoạch ngân sách', 'Điều phối ngày cưới']
      }
    },
    {
      title: { en: 'Partial Wedding Planning', vi: 'Tổ chức tiệc cưới một phần' },
      description: { 
        en: 'Perfect for couples who want professional assistance with specific aspects of their wedding while maintaining control over other elements.',
        vi: 'Hoàn hảo cho các cặp đôi muốn được hỗ trợ chuyên nghiệp với các khía cạnh cụ thể của đám cưới trong khi vẫn kiểm soát các yếu tố khác.'
      },
      features: {
        en: ['Vendor recommendations', 'Design consultation', 'Timeline assistance', 'Final month coordination'],
        vi: ['Giới thiệu nhà cung cấp', 'Tư vấn thiết kế', 'Hỗ trợ lập kế hoạch', 'Điều phối tháng cuối']
      }
    },
    {
      title: { en: 'Day-of Coordination', vi: 'Điều phối ngày cưới' },
      description: { 
        en: 'Ensure your wedding day runs smoothly with our professional coordination services. We manage all vendors and timeline execution.',
        vi: 'Đảm bảo ngày cưới của bạn diễn ra suôn sẻ với dịch vụ điều phối chuyên nghiệp của chúng tôi. Chúng tôi quản lý tất cả nhà cung cấp và thực hiện lịch trình.'
      },
      features: {
        en: ['Vendor coordination', 'Timeline management', 'Emergency handling', 'Guest assistance'],
        vi: ['Điều phối nhà cung cấp', 'Quản lý lịch trình', 'Xử lý tình huống khẩn cấp', 'Hỗ trợ khách mời']
      }
    }
  ];

  return (
    <div className="  bg-background-1">
      <Header lang={lang} />

      {/* Hero Section */}
      <section className="py-20  ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? 'Our Services' : 'Dịch vụ của chúng tôi'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'We offer comprehensive wedding planning services tailored to your unique vision and budget. Let us help you create the wedding of your dreams.'
              : 'Chúng tôi cung cấp dịch vụ tổ chức tiệc cưới toàn diện phù hợp với tầm nhìn độc đáo và ngân sách của bạn. Hãy để chúng tôi giúp bạn tạo ra đám cưới trong mơ.'
            }
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-12">
            {services.map((service, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <h2 className="text-3xl font-light text-gray-900 mb-4">
                    {lang === 'en' ? service.title.en : service.title.vi}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    {lang === 'en' ? service.description.en : service.description.vi}
                  </p>
                  <ul className="space-y-2">
                    {(lang === 'en' ? service.features.en : service.features.vi).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-16  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Specialized Wedding Types' : 'Loại tiệc cưới chuyên biệt'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'Discover our specialized planning services for different wedding styles'
                : 'Khám phá các dịch vụ lập kế hoạch chuyên biệt cho các phong cách tiệc cưới khác nhau'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background-1 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                {lang === 'en' ? 'Destination Weddings' : 'Tiệc cưới điểm đến'}
              </h3>
              <p className="text-gray-600 mb-6">
                {lang === 'en' 
                  ? 'Create magical memories in breathtaking locations. Perfect for couples seeking adventure and unique experiences.'
                  : 'Tạo nên những kỷ niệm kỳ diệu tại những địa điểm ngoạn mục. Hoàn hảo cho các cặp đôi tìm kiếm phiêu lưu và trải nghiệm độc đáo.'
                }
              </p>
              <a 
                href={`/${lang}/service/destination-wedding`}
                className="inline-flex items-center text-gray-900 hover:text-gray-600 font-medium transition-colors"
              >
                {lang === 'en' ? 'Learn More' : 'Tìm hiểu thêm'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="bg-background-1 p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                {lang === 'en' ? 'City Weddings' : 'Tiệc cưới thành phố'}
              </h3>
              <p className="text-gray-600 mb-6">
                {lang === 'en' 
                  ? 'Embrace urban sophistication with elegant city celebrations. Perfect for modern couples who love metropolitan energy.'
                  : 'Tận hưởng sự tinh tế đô thị với những lễ kỷ niệm thành phố thanh lịch. Hoàn hảo cho các cặp đôi hiện đại yêu thích năng lượng đô thị.'
                }
              </p>
              <a 
                href={`/${lang}/service/city-wedding`}
                className="inline-flex items-center text-gray-900 hover:text-gray-600 font-medium transition-colors"
              >
                {lang === 'en' ? 'Learn More' : 'Tìm hiểu thêm'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === 'en' ? 'Ready to Start Planning?' : 'Sẵn sàng bắt đầu lên kế hoạch?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en' 
              ? "Let's discuss your vision and create a customized plan that fits your needs and budget."
              : 'Hãy thảo luận về tầm nhìn của bạn và tạo ra một kế hoạch tùy chỉnh phù hợp với nhu cầu và ngân sách của bạn.'
            }
          </p>
          <div className="space-x-4">
            <a 
              href={`/${lang}/lets-connect`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === 'en' ? 'Get In Touch' : 'Liên hệ'}
            </a>
            <a 
              href={`/${lang}/journal`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'View Our Work' : 'Xem tác phẩm'}
            </a>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
