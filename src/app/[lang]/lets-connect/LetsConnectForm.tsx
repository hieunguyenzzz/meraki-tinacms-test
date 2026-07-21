'use client';

import { useState } from 'react';

type LocalizedText = { en: string; vi: string };

const t = (text: LocalizedText, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const copy = {
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
  sending: { en: 'Sending...', vi: 'Đang gửi...' },
  success: {
    en: "Thank you! We've received your message and will be in touch soon.",
    vi: 'Cảm ơn bạn! Meraki đã nhận được thông tin và sẽ liên hệ sớm nhất có thể.',
  },
  error: {
    en: 'Something went wrong. Please try again or email us directly at contact@merakiwp.com.',
    vi: 'Đã có lỗi xảy ra. Vui lòng thử lại hoặc gửi email trực tiếp cho chúng tôi qua contact@merakiwp.com.',
  },
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

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LetsConnectForm({ lang }: { lang: string }) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const guestCountValue = formData.get('guestCount');

    const payload = {
      lang,
      company: formData.get('company'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
      partnerName: formData.get('partnerName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      weddingDate: formData.get('weddingDate'),
      venue: formData.get('venue'),
      guestCount: guestCountValue ? Number(guestCountValue) : null,
      budget: formData.get('budget'),
      extraEvents: formData.getAll('extraEvents'),
      referralSource: formData.getAll('referralSource'),
      otherNotes: formData.get('otherNotes'),
    };

    setStatus('submitting');

    try {
      const response = await fetch('/api/lets-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Request failed');

      setStatus('success');
      form.reset();
    } catch (error) {
      console.error('Failed to submit Let\'s Connect form:', error);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-paper relative z-10 -mt-8 flex min-h-[200px] items-center bg-background-1 px-5 py-7 text-center shadow-sm md:-mt-16 md:px-8 md:py-9 lg:-mt-40 lg:px-9 lg:py-10">
        <p className="text-body-md leading-relaxed text-text-primary">{t(copy.success, lang)}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper relative z-10 -mt-8 bg-background-1 px-5 py-7 shadow-sm md:-mt-16 md:px-8 md:py-9 lg:-mt-40 lg:px-9 lg:py-10"
    >
      {/* Honeypot: hidden from real users; bots that fill it are silently dropped server-side. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="relative z-[1]">
        <fieldset>
          <legend className="font-vocago text-h4 text-text-primary">
            {t(copy.personalInfo, lang)}
          </legend>
          <div className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
            <Field id="lastName" label={t(copy.lastName, lang)} required />
            <Field id="firstName" label={t(copy.firstName, lang)} required />
            <Field id="role" label={t(copy.role, lang)} hint={t(copy.roleHint, lang)} />
            <Field id="partnerName" label={t(copy.partnerName, lang)} />
            <Field
              id="email"
              label={t(copy.email, lang)}
              type="email"
              required
              className="sm:col-span-2"
            />
            <Field id="phone" label={t(copy.phone, lang)} type="tel" hint={t(copy.phoneHint, lang)} />
            <Field id="location" label={t(copy.location, lang)} />
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="font-vocago text-h4 text-text-primary">
            {t(copy.weddingInfo, lang)}
          </legend>
          <div className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
            <Field id="weddingDate" label={t(copy.weddingDate, lang)} type="date" />
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
          <p className="mt-6 text-body-sm text-text-secondary">{t(copy.extraEvents, lang)}</p>
          <CheckboxList name="extraEvents" options={eventOptions} lang={lang} />
        </fieldset>

        <fieldset className="mt-12">
          <legend className="font-vocago text-h4 text-text-primary">
            {t(copy.additionalInfo, lang)}
          </legend>
          <p className="mt-5 border-b border-line-primary pb-2 text-body-sm text-text-secondary">
            {t(copy.referral, lang)}
          </p>
          <CheckboxList name="referralSource" options={referralOptions} lang={lang} />
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

        {status === 'error' && (
          <p className="mt-6 text-center text-body-sm text-text-accent">{t(copy.error, lang)}</p>
        )}

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="border-b border-line-primary px-7 pb-1 text-body-md uppercase tracking-[0.08em] text-text-primary transition-all hover:-translate-y-0.5 hover:border-text-accent hover:text-text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? t(copy.sending, lang) : t(copy.send, lang)}
          </button>
        </div>
      </div>
    </form>
  );
}
