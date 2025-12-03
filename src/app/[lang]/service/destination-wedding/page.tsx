import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'en' ? 'Destination Wedding Planning - Meraki Wedding Planner' : 'Tổ chức tiệc cưới điểm đến - Meraki Wedding Planner',
    description: lang === 'en' 
      ? 'Expert destination wedding planning services for your dream wedding in exotic locations worldwide'
      : 'Dịch vụ tổ chức tiệc cưới điểm đến chuyên nghiệp cho đám cưới mơ ước của bạn tại các địa điểm kỳ thú trên toàn thế giới',
  };
}

export default function DestinationWeddingPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const destinations = [
    {
      name: { en: 'Da Nang & Hoi An', vi: 'Đà Nẵng & Hội An' },
      description: { 
        en: 'Stunning beaches, historic charm, and world-class resorts make this the perfect romantic destination.',
        vi: 'Những bãi biển tuyệt đẹp, nét quyến rũ lịch sử và các resort đẳng cấp thế giới làm cho đây trở thành điểm đến lãng mạn hoàn hảo.'
      },
      highlights: {
        en: ['Beachfront ceremonies', 'Historic venues', 'Luxury resorts', 'Cultural experiences'],
        vi: ['Lễ cưới bên bờ biển', 'Địa điểm lịch sử', 'Resort sang trọng', 'Trải nghiệm văn hóa']
      }
    },
    {
      name: { en: 'Phu Quoc Island', vi: 'Đảo Phú Quốc' },
      description: { 
        en: 'Tropical paradise with pristine beaches, crystal-clear waters, and unforgettable sunsets.',
        vi: 'Thiên đường nhiệt đới với những bãi biển nguyên sơ, nước trong vắt và hoàng hôn khó quên.'
      },
      highlights: {
        en: ['Sunset ceremonies', 'Island resorts', 'Water activities', 'Fresh seafood'],
        vi: ['Lễ cưới hoàng hôn', 'Resort trên đảo', 'Hoạt động nước', 'Hải sản tươi sống']
      }
    },
    {
      name: { en: 'Sapa Mountains', vi: 'Núi Sapa' },
      description: { 
        en: 'Breathtaking mountain views, terraced rice fields, and unique cultural experiences.',
        vi: 'Tầm nhìn núi non ngoạn mục, ruộng bậc thang và trải nghiệm văn hóa độc đáo.'
      },
      highlights: {
        en: ['Mountain ceremonies', 'Terraced landscapes', 'Cultural immersion', 'Adventure activities'],
        vi: ['Lễ cưới trên núi', 'Phong cảnh ruộng bậc thang', 'Hòa nhập văn hóa', 'Hoạt động phiêu lưu']
      }
    }
  ];

  const planningSteps = [
    {
      step: 1,
      title: { en: 'Destination Selection', vi: 'Chọn điểm đến' },
      description: { 
        en: 'We help you choose the perfect location based on your vision, budget, and guest requirements.',
        vi: 'Chúng tôi giúp bạn chọn địa điểm hoàn hảo dựa trên tầm nhìn, ngân sách và yêu cầu của khách mời.'
      }
    },
    {
      step: 2,
      title: { en: 'Venue Coordination', vi: 'Điều phối địa điểm' },
      description: { 
        en: 'Secure the ideal venue and coordinate all location-specific requirements and logistics.',
        vi: 'Đảm bảo địa điểm lý tưởng và điều phối tất cả các yêu cầu và hậu cần cụ thể của địa điểm.'
      }
    },
    {
      step: 3,
      title: { en: 'Guest Travel Assistance', vi: 'Hỗ trợ du lịch khách mời' },
      description: { 
        en: 'Arrange accommodations, transportation, and activities for your wedding guests.',
        vi: 'Sắp xếp chỗ ở, phương tiện di chuyển và các hoạt động cho khách mời đám cưới của bạn.'
      }
    },
    {
      step: 4,
      title: { en: 'Local Vendor Network', vi: 'Mạng lưới nhà cung cấp địa phương' },
      description: { 
        en: 'Connect with trusted local vendors for photography, catering, florals, and entertainment.',
        vi: 'Kết nối với các nhà cung cấp địa phương đáng tin cậy về chụp ảnh, catering, hoa và giải trí.'
      }
    },
    {
      step: 5,
      title: { en: 'Legal Requirements', vi: 'Yêu cầu pháp lý' },
      description: { 
        en: 'Navigate marriage license requirements and legal documentation for your destination.',
        vi: 'Hướng dẫn các yêu cầu giấy phép kết hôn và tài liệu pháp lý cho điểm đến của bạn.'
      }
    },
    {
      step: 6,
      title: { en: 'Day-of Coordination', vi: 'Điều phối ngày cưới' },
      description: { 
        en: 'On-site management to ensure everything runs smoothly in your chosen destination.',
        vi: 'Quản lý tại chỗ để đảm bảo mọi thứ diễn ra suôn sẻ tại điểm đến bạn chọn.'
      }
    }
  ];

  return (
    <div className="  bg-background-1">
      <Header lang={lang} />

      {/* Breadcrumb */}
      <div className="  py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href={`/${lang}`} className="text-gray-500 hover:text-gray-700">
                  {lang === 'en' ? 'Home' : 'Trang chủ'}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href={`/${lang}/service`} className="text-gray-500 hover:text-gray-700">
                  {lang === 'en' ? 'Services' : 'Dịch vụ'}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900">
                {lang === 'en' ? 'Destination Wedding' : 'Tiệc cưới điểm đến'}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? 'Destination Wedding Planning' : 'Tổ chức tiệc cưới điểm đến'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Create magical memories in breathtaking locations. We specialize in destination weddings that combine your love story with the beauty of extraordinary places.'
              : 'Tạo nên những kỷ niệm kỳ diệu tại những địa điểm ngoạn mục. Chúng tôi chuyên tổ chức tiệc cưới điểm đến kết hợp câu chuyện tình yêu của bạn với vẻ đẹp của những nơi phi thường.'
            }
          </p>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Popular Destinations' : 'Điểm đến phổ biến'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'Discover some of our most sought-after wedding destinations in Vietnam'
                : 'Khám phá một số điểm đến tổ chức tiệc cưới được yêu thích nhất tại Việt Nam'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-background-1 rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    {lang === 'en' ? destination.name.en : destination.name.vi}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {lang === 'en' ? destination.description.en : destination.description.vi}
                  </p>
                  <ul className="space-y-2">
                    {(lang === 'en' ? destination.highlights.en : destination.highlights.vi).map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Process */}
      <section className="py-16  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {lang === 'en' ? 'Our Planning Process' : 'Quy trình lập kế hoạch'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lang === 'en' 
                ? 'We guide you through every step to ensure your destination wedding is flawless'
                : 'Chúng tôi hướng dẫn bạn qua từng bước để đảm bảo tiệc cưới điểm đến của bạn hoàn hảo'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planningSteps.map((step, index) => (
              <div key={index} className="bg-background-1 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {lang === 'en' ? step.title.en : step.title.vi}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {lang === 'en' ? step.description.en : step.description.vi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === 'en' ? 'Ready to Plan Your Dream Destination Wedding?' : 'Sẵn sàng lập kế hoạch cho tiệc cưới điểm đến mơ ước?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en' 
              ? 'Let us help you create an unforgettable celebration in your perfect location.'
              : 'Hãy để chúng tôi giúp bạn tạo ra một lễ kỷ niệm khó quên tại địa điểm hoàn hảo của bạn.'
            }
          </p>
          <div className="space-x-4">
            <Link
              href={`/${lang}/lets-connect`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === 'en' ? 'Start Planning' : 'Bắt đầu lập kế hoạch'}
            </Link>
            <Link
              href={`/${lang}/journal`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
            >
              {lang === 'en' ? 'View Portfolio' : 'Xem danh mục'}
            </Link>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
