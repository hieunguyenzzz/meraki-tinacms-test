import type { Metadata } from 'next';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import MerakiImage from '../../../components/ui/MerakiImage';
import { client } from '../../../../tina/__generated__/client';

interface Props {
  params: { lang: string };
}

type LocalizedText = { en: string; vi: string };

interface InstagramItem {
  image?: string | null;
  link?: string | null;
}

const HERO_IMAGE =
  'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/an-joel/5_b_%20Evening%20Reception_023.jpg';

const FALLBACK_INSTAGRAM_ITEMS: InstagramItem[] = [
  {
    image:
      'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/giang-hiep/SneakpeekweddingG%26H-168.jpg',
    link: 'https://www.instagram.com/meraki.wedding.planner',
  },
  {
    image:
      'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/an-joel/4_%20Evening%20Decorations%20Details_026.jpg',
    link: 'https://www.instagram.com/meraki.wedding.planner',
  },
  {
    image:
      'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/cindy-josh/5.jpg',
    link: 'https://www.instagram.com/meraki.wedding.planner',
  },
  {
    image:
      'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/han-kiet/WeddingdayK%26H-3.jpg',
    link: 'https://www.instagram.com/meraki.wedding.planner',
  },
  {
    image:
      'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/about-us/MERAKI-580.jpg',
    link: 'https://www.instagram.com/meraki.wedding.planner',
  },
  {
    image:
      'https://merakiweddingplanner.s3.ap-southeast-1.amazonaws.com/journal/tess-andy/_AND7002.jpg',
    link: 'https://www.instagram.com/meraki.wedding.planner',
  },
];

const t = (text: LocalizedText, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const copy = {
  hero: { en: "Let's connect to begin", vi: 'Kết nối để bắt đầu' },
  introTitle: {
    en: 'Congratulations on this beautiful milestone!',
    vi: 'Chúc mừng một cột mốc mới của hai bạn!',
  },
  introParagraphs: {
    en: [
      'The journey is most beautiful when it begins with a heartfelt conversation. Let us hear about your story, your dreams, and the emotions you hope to share on your wedding day.',
      'If you feel Meraki is the right match, leave us a note. We will respond with warmth, sincerity, and thoughtful guidance.',
      'Before completing the form, you may also explore our next steps below.',
    ],
    vi: [
      'Hành trình đẹp nhất vừa bắt đầu thôi! Hãy cùng nhau nghĩ về một đám cưới đầy cảm xúc và kỷ niệm. Tụi mình rất vui nếu được là một phần trong hành trình ấy, cùng hai bạn đi qua từng khoảnh khắc đáng nhớ.',
      'Nếu bạn thấy Meraki là mảnh ghép phù hợp, hãy để lại cho tụi mình một lời nhắn. Meraki sẽ hồi âm sớm nhất có thể, bằng tất cả sự chân thành và yêu thương.',
      'Nếu cần thêm thông tin, bạn cũng có thể liên hệ trực tiếp qua:',
    ],
  },
  personalInfo: { en: 'Personal information', vi: 'Thông tin cá nhân' },
  weddingInfo: { en: 'Wedding information', vi: 'Thông tin đám cưới' },
  additionalInfo: { en: 'A few more details', vi: 'Thông tin bổ sung' },
  firstName: { en: 'First name', vi: 'Tên' },
  lastName: { en: 'Last name', vi: 'Họ' },
  role: { en: 'I am...', vi: 'Tôi là...' },
  partnerName: { en: "Partner's name", vi: 'Tên cặp đôi' },
  roleHint: {
    en: 'Bride/Groom\nParent of the couple\nFriend or family\nOther',
    vi: 'Cô dâu/Chú rể\nCha mẹ của cô dâu/chú rể\nBạn của cô dâu/chú rể\nKhác',
  },
  email: { en: 'Email address', vi: 'Địa chỉ email' },
  phone: { en: 'Phone number', vi: 'Số điện thoại' },
  location: { en: 'Current location', vi: 'Nơi đang sinh sống' },
  phoneHint: {
    en: 'Please include your country code if you are living abroad.',
    vi: 'Chúng tôi sẽ không gọi, chỉ để tránh trường hợp có sự nhầm lẫn với địa chỉ email của bạn.',
  },
  weddingDate: { en: 'Wedding date', vi: 'Ngày cưới' },
  venue: { en: 'Wedding venue/city', vi: 'Địa điểm tổ chức/Thành phố' },
  guestCount: { en: 'Estimated guest count', vi: 'Số lượng khách mời' },
  budget: { en: 'Estimated budget', vi: 'Ngân sách dự kiến' },
  budgetHint: {
    en: 'This helps us recommend an approach that suits you.',
    vi: 'Giúp chúng tôi xác định mức độ hỗ trợ phù hợp với bạn.',
  },
  extraEvents: {
    en: 'Besides the main wedding, would you like to add another event?',
    vi: 'Ngoài lễ cưới chính, bạn muốn có thêm hoạt động nào?',
  },
  referral: { en: 'How did you hear about Meraki?', vi: 'Bạn biết Meraki qua đâu?' },
  otherNotes: {
    en: 'Anything else you would love us to know',
    vi: 'Những điều khác mà chúng tôi nên biết',
  },
  notesHint: {
    en: 'How did you meet?\nWhat do you enjoy doing together?\nWhat matters most to you on your wedding day?',
    vi: 'Các bạn đã gặp nhau thế nào?\nCác bạn đã cầu hôn thế nào? Ở đâu?\nĐám cưới trong mơ của bạn sẽ diễn ra như thế nào?',
  },
  send: { en: 'Send', vi: 'Gửi' },
  faq: { en: 'FAQs', vi: 'FAQs' },
  instagram: { en: 'Instagram', vi: 'Instagram' },
};

const eventOptions: LocalizedText[] = [
  { en: 'Vow Ceremony', vi: 'Vow Ceremony' },
  { en: 'Welcome Dinner', vi: 'Welcome Dinner' },
  { en: 'After Party', vi: 'After Party' },
  { en: 'Farewell Brunch', vi: 'Farewell Brunch' },
  {
    en: 'Traditional engagement ceremony',
    vi: 'Nghi lễ cưới truyền thống (Lễ Ăn hỏi/Lễ Đón dâu)',
  },
  {
    en: 'Religious wedding ceremony',
    vi: 'Nghi lễ tôn giáo (Thánh Lễ Hôn Phối/Lễ Hằng Thuận)',
  },
  {
    en: 'Cultural wedding ceremony',
    vi: 'Nghi lễ cưới đa văn hoá (Trà Lễ Trung Hoa/Lễ cưới Do Thái/Nikkah)',
  },
];

const referralOptions: LocalizedText[] = [
  { en: 'Facebook', vi: 'Facebook' },
  { en: 'Instagram', vi: 'Instagram' },
  { en: 'Website', vi: 'Website' },
  { en: 'Recommendation from friends or family', vi: 'Được giới thiệu qua người quen' },
  { en: 'Other', vi: 'Khác' },
];

const faqs: { question: LocalizedText; answer: LocalizedText }[] = [
  {
    question: {
      en: 'What happens after I submit my information?',
      vi: 'Bước tiếp theo sau khi gửi thông tin là gì?',
    },
    answer: {
      en: 'After receiving your information, Meraki will reply and arrange a conversation so we can understand your vision more clearly. We believe every wedding deserves a thoughtful, personal approach. If we are the right fit, we will share the next planning steps with you.',
      vi: 'Sau khi bạn gửi thông tin, Meraki sẽ phản hồi và hẹn lịch trao đổi để team có thể hiểu hơn mong muốn của bạn cho đám cưới. Vậy nên, nếu đã có sẵn ý tưởng, hãy gửi cho tụi mình để được tư vấn chính xác hơn. Còn nếu bạn vẫn đang ở những bước đầu, hãy xem đây là một buổi chia sẻ để có thêm tips cho quá trình planning nhé!',
    },
  },
  {
    question: {
      en: 'How soon will Meraki respond?',
      vi: 'Thời gian phản hồi của Meraki?',
    },
    answer: {
      en: 'We usually reply within two working days. If you have not heard from us after that, please check your spam folder or contact us directly by email.',
      vi: 'Sẽ mất khoảng 2 đến 3 ngày để tụi mình xử lý thông tin và liên hệ lại với bạn, đừng lo lắng mà hãy đợi mail của Meraki nhé!',
    },
  },
  {
    question: {
      en: 'How does Meraki select its vendor partners?',
      vi: 'Danh sách đối tác của Meraki được lựa chọn thế nào?',
    },
    answer: {
      en: 'Our partners are selected for their expertise and their ability to respond to each couple’s unique needs. Every recommendation considers quality, style, budget, and the way a team works together. You always have the final choice; our role is to help you find the best fit.',
      vi: 'Danh sách vendor của Meraki luôn đa dạng và được cá nhân hóa theo nhu cầu riêng của từng cặp đôi. Mỗi đối tác đều được chọn lọc kỹ lưỡng, dựa trên phong cách, mong muốn và ngân sách của bạn. Tụi mình cũng sẽ chia sẻ thêm những ghi chú và kinh nghiệm từ các lần hợp tác trước, để giúp bạn có thêm góc nhìn và đưa ra lựa chọn phù hợp nhất.',
    },
  },
];

function Field({
  id,
  label,
  type = 'text',
  hint,
  required,
  className = '',
}: {
  id: string;
  label: string;
  type?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-body-sm text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="mt-1 w-full border-0 border-b border-line-primary bg-transparent px-0 py-2 text-body-sm text-text-primary outline-none transition-colors focus:border-text-primary focus:ring-0"
      />
      {hint && (
        <p className="mt-1 whitespace-pre-line text-[11px] leading-[15px] text-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
}

function CheckboxList({
  name,
  options,
  lang,
}: {
  name: string;
  options: LocalizedText[];
  lang: string;
}) {
  return (
    <div className="mt-3 space-y-3">
      {options.map((option, index) => (
        <label
          key={`${name}-${index}`}
          className="flex cursor-pointer items-start gap-2 text-body-sm text-text-secondary"
        >
          <input
            type="checkbox"
            name={name}
            value={option.en}
            className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-line-primary bg-transparent checked:bg-shape-primary checked:shadow-[inset_0_0_0_3px_var(--color-bg-1)] focus:outline-none focus:ring-1 focus:ring-line-accent"
          />
          <span>{t(option, lang)}</span>
        </label>
      ))}
    </div>
  );
}

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;

  return {
    title:
      lang === 'en'
        ? "Let's Connect - Meraki Wedding Planner"
        : 'Kết nối - Meraki Wedding Planner',
    description:
      lang === 'en'
        ? 'Tell Meraki about your wedding and begin planning a meaningful celebration.'
        : 'Chia sẻ câu chuyện đám cưới của bạn và bắt đầu hành trình planning cùng Meraki.',
  };
}

export default async function LetsConnectPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  let instagramItems = FALLBACK_INSTAGRAM_ITEMS;

  try {
    const response = await client.queries.page({ relativePath: 'index.mdx' });
    const homeItems = response.data.page.instagram_section?.images;

    if (homeItems?.length) {
      instagramItems = homeItems
        .filter((item) => Boolean(item?.image))
        .map((item) => ({ image: item?.image, link: item?.link }));
    }
  } catch (error) {
    console.error('Unable to load shared Instagram content:', error);
  }

  return (
    <div className="overflow-hidden bg-background-base text-text-primary">
      <Header lang={lang} />

      <main>
        <section className="relative h-[460px] overflow-hidden md:h-[620px] lg:h-[760px]">
          <MerakiImage
            src={HERO_IMAGE}
            alt={t(
              {
                en: 'An outdoor wedding reception beneath the evening sky',
                vi: 'Tiệc cưới ngoài trời dưới bầu trời đêm',
              },
              lang
            )}
            fill
            priority
            sizes="100vw"
            thumborFitMode=""
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/10" />
          <h1 className="absolute inset-x-6 top-16 text-center font-vocago text-h1 uppercase tracking-[0.04em] text-background-base md:top-24 md:text-display lg:top-28">
            {t(copy.hero, lang)}
          </h1>
        </section>

        <section className="px-5 pb-20 md:px-10 md:pb-28 lg:pb-36">
          <div className="mx-auto grid max-w-[1430px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(560px,680px)] lg:gap-20 xl:gap-28">
            <div className="pt-16 md:pt-20 lg:pt-24">
              <div className="max-w-[680px]">
                <h2 className="font-vocago text-h3 text-text-accent">
                  {t(copy.introTitle, lang)}
                </h2>
                <div className="mt-5 space-y-4 text-body-md leading-relaxed text-text-secondary">
                  {copy.introParagraphs[lang as 'en' | 'vi'].map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-5 grid gap-5 text-body-sm uppercase text-text-secondary sm:grid-cols-2">
                  <p>
                    <span className="block">Email</span>
                    <a
                      href="mailto:contact@merakiwp.com"
                      className="normal-case transition-colors hover:text-text-accent"
                    >
                      contact@merakiwp.com
                    </a>
                  </p>
                  <p>
                    <span className="block">Hotline / Zalo / WhatsApp</span>
                    <a
                      href="tel:+82965492092"
                      className="normal-case transition-colors hover:text-text-accent"
                    >
                      (+82) 965492092
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <form className="bg-paper relative z-10 -mt-8 bg-background-1 px-5 py-7 shadow-sm md:-mt-16 md:px-8 md:py-9 lg:-mt-40 lg:px-9 lg:py-10">
              <div className="relative z-[1]">
                <fieldset>
                  <legend className="font-vocago text-h4 text-text-primary">
                    {t(copy.personalInfo, lang)}
                  </legend>
                  <div className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
                    <Field id="lastName" label={t(copy.lastName, lang)} required />
                    <Field id="firstName" label={t(copy.firstName, lang)} required />
                    <Field
                      id="role"
                      label={t(copy.role, lang)}
                      hint={t(copy.roleHint, lang)}
                    />
                    <Field id="partnerName" label={t(copy.partnerName, lang)} />
                    <Field
                      id="email"
                      label={t(copy.email, lang)}
                      type="email"
                      required
                      className="sm:col-span-2"
                    />
                    <Field
                      id="phone"
                      label={t(copy.phone, lang)}
                      type="tel"
                      hint={t(copy.phoneHint, lang)}
                    />
                    <Field id="location" label={t(copy.location, lang)} />
                  </div>
                </fieldset>

                <fieldset className="mt-12">
                  <legend className="font-vocago text-h4 text-text-primary">
                    {t(copy.weddingInfo, lang)}
                  </legend>
                  <div className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
                    <Field
                      id="weddingDate"
                      label={t(copy.weddingDate, lang)}
                      type="date"
                    />
                    <Field id="venue" label={t(copy.venue, lang)} />
                    <Field
                      id="guestCount"
                      label={t(copy.guestCount, lang)}
                      type="number"
                      className="sm:col-span-2"
                    />
                    <Field
                      id="budget"
                      label={t(copy.budget, lang)}
                      hint={t(copy.budgetHint, lang)}
                      className="sm:col-span-2"
                    />
                  </div>
                  <p className="mt-6 text-body-sm text-text-secondary">
                    {t(copy.extraEvents, lang)}
                  </p>
                  <CheckboxList name="extraEvents" options={eventOptions} lang={lang} />
                </fieldset>

                <fieldset className="mt-12">
                  <legend className="font-vocago text-h4 text-text-primary">
                    {t(copy.additionalInfo, lang)}
                  </legend>
                  <p className="mt-5 border-b border-line-primary pb-2 text-body-sm text-text-secondary">
                    {t(copy.referral, lang)}
                  </p>
                  <CheckboxList
                    name="referralSource"
                    options={referralOptions}
                    lang={lang}
                  />
                  <div className="mt-7">
                    <label
                      htmlFor="otherNotes"
                      className="block border-b border-line-primary pb-2 text-body-sm text-text-secondary"
                    >
                      {t(copy.otherNotes, lang)}
                    </label>
                    <textarea
                      id="otherNotes"
                      name="otherNotes"
                      rows={4}
                      placeholder={t(copy.notesHint, lang)}
                      className="mt-2 w-full resize-y border-0 bg-transparent px-0 text-body-sm text-text-primary outline-none placeholder:whitespace-pre-line placeholder:text-[11px] placeholder:leading-[15px] placeholder:text-text-tertiary focus:ring-0"
                    />
                  </div>
                </fieldset>

                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    className="border-b border-line-primary px-7 pb-1 text-body-md uppercase tracking-[0.08em] text-text-primary transition-all hover:-translate-y-0.5 hover:border-text-accent hover:text-text-accent"
                  >
                    {t(copy.send, lang)}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="bg-background-support1 px-5 py-20 md:px-10 md:py-24">
          <div className="mx-auto max-w-[720px]">
            <h2 className="text-center font-vocago text-h1 text-text-primary">
              {t(copy.faq, lang)}
            </h2>
            <div className="mt-8 divide-y divide-line-primary border-b border-line-primary">
              {faqs.map((faq, index) => (
                <details key={faq.question.en} className="group py-5" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-body-md text-text-primary marker:content-none">
                    <span>{t(faq.question, lang)}</span>
                    <span aria-hidden="true" className="text-body-lg leading-none">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-body-sm leading-relaxed text-text-secondary">
                    {t(faq.answer, lang)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-20">
          <h2 className="text-center font-vocago text-h2 text-text-accent md:text-h3">
            {t(copy.instagram, lang)}
          </h2>
          <div className="mx-auto mt-8 grid max-w-[1450px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {instagramItems.map((item, index) => {
              if (!item.image) return null;

              return (
                <a
                  key={`${item.image}-${index}`}
                  href={item.link || 'https://www.instagram.com/meraki.wedding.planner'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden bg-background-1"
                  aria-label={`View Instagram feature ${index + 1}`}
                >
                  <MerakiImage
                    src={item.image}
                    alt={`Meraki wedding inspiration ${index + 1}`}
                    fill
                    sizes="(min-width: 1280px) 16vw, (min-width: 744px) 33vw, 50vw"
                    thumborFitMode=""
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              );
            })}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
