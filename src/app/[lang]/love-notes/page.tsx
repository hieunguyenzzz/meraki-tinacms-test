/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour (ISR)

// Pre-generate both language versions
export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'vi' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;

  return {
    title: lang === 'en' ? 'Love Notes - Meraki Wedding Planner' : 'Lời cảm ơn - Meraki Wedding Planner',
    description: lang === 'en'
      ? 'Kind words and testimonials from our beautiful couples'
      : 'Những lời cảm ơn và nhận xét từ các cặp đôi xinh đẹp của chúng tôi',
  };
}

export default async function LoveNotesPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  return (
    <div className="  bg-background-1">
      <Header lang={lang} />

      {/* Hero Section */}
      <section className="py-20  ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            {lang === 'en' ? 'Love Notes' : 'Lời cảm ơn'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'Nothing brings us more joy than hearing from our couples about their special day. Here are some of their kind words.'
              : 'Không có gì khiến chúng tôi vui hơn việc nghe từ các cặp đôi về ngày đặc biệt của họ. Đây là một số lời cảm ơn chân thành.'
            }
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16  ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            {lang === 'en' ? 'Ready to Create Your Own Love Story?' : 'Sẵn sàng tạo nên câu chuyện tình yêu của riêng bạn?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en' 
              ? "Let's work together to create a wedding day that you'll cherish forever."
              : 'Hãy cùng nhau tạo ra một ngày cưới mà bạn sẽ trân trọng mãi mãi.'
            }
          </p>
          <div className="space-x-4">
            <a 
              href={`/${lang}/lets-connect`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {lang === 'en' ? 'Start Planning' : 'Bắt đầu lên kế hoạch'}
            </a>
            <a 
              href={`/${lang}/journal`}
              className="inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
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
