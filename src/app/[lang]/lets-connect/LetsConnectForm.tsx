'use client';

import { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { trackEvent } from '../../../lib/analytics';
import type { LetsConnectForm as LetsConnectFormContent } from '../../../../tina/__generated__/types';

const localized = (
  english?: string | null,
  vietnamese?: string | null,
  lang = 'en'
) => (lang === 'en' ? english : vietnamese) || '';

function Field({
  id,
  label,
  type = 'text',
  hint,
  required,
  className = '',
  cmsField,
}: {
  id: string;
  label: string;
  type?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  cmsField?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-body-sm text-text-secondary"
        data-tina-field={cmsField}
      >
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
  options: Array<{ label_en: string; label_vi: string } | null>;
  lang: string;
}) {
  // At least one option must be picked. HTML `required` on a checkbox only
  // demands that single box, so mark every box required until one is checked.
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="mt-3 space-y-3">
      {options.map(
        (option, index) =>
          option && (
            <label
              key={`${name}-${index}`}
              className="flex cursor-pointer items-start gap-2 text-body-sm text-text-secondary"
            >
              <input
                type="checkbox"
                name={name}
                value={option.label_en}
                required={selected.length === 0}
                checked={selected.includes(option.label_en)}
                onChange={(event) => {
                  const { value, checked } = event.currentTarget;
                  setSelected((previous) =>
                    checked
                      ? [...previous, value]
                      : previous.filter((entry) => entry !== value)
                  );
                }}
                className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-line-primary bg-transparent checked:bg-shape-primary checked:shadow-[inset_0_0_0_3px_var(--color-bg-1)] focus:outline-none focus:ring-1 focus:ring-line-accent"
              />
              <span
                data-tina-field={tinaField(
                  option,
                  lang === 'en' ? 'label_en' : 'label_vi'
                )}
              >
                {localized(option.label_en, option.label_vi, lang)}
              </span>
            </label>
          )
      )}
    </div>
  );
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LetsConnectForm({
  lang,
  content,
}: {
  lang: string;
  content: LetsConnectFormContent;
}) {
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
      // Same event name the old site used, so the Umami history is continuous.
      // Nothing from the payload is sent — enquiry details are lead data and do
      // not belong in a third-party tool.
      trackEvent('contact_us', {
        form_type: 'lets_connect',
        outcome: 'success',
        lang,
      });
      form.reset();
    } catch (error) {
      console.error("Failed to submit Let's Connect form:", error);
      setStatus('error');
      trackEvent('contact_us', {
        form_type: 'lets_connect',
        outcome: 'error',
        lang,
      });
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-paper relative z-10 -mt-8 flex min-h-[200px] items-center bg-background-1 px-5 py-7 text-center shadow-sm md:-mt-16 md:px-8 md:py-9 lg:-mt-40 lg:px-9 lg:py-10">
        <p
          className="text-body-md leading-relaxed text-text-primary"
          data-tina-field={tinaField(
            content,
            lang === 'en' ? 'success_message_en' : 'success_message_vi'
          )}
        >
          {localized(
            content.success_message_en,
            content.success_message_vi,
            lang
          )}
        </p>
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
          <legend
            className="font-vocago text-h4 text-text-primary"
            data-tina-field={tinaField(
              content,
              lang === 'en'
                ? 'personal_info_title_en'
                : 'personal_info_title_vi'
            )}
          >
            {localized(
              content.personal_info_title_en,
              content.personal_info_title_vi,
              lang
            )}
          </legend>
          <div className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
            <Field
              id="lastName"
              label={localized(
                content.last_name_label_en,
                content.last_name_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'last_name_label_en' : 'last_name_label_vi'
              )}
              required
            />
            <Field
              id="firstName"
              label={localized(
                content.first_name_label_en,
                content.first_name_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'first_name_label_en' : 'first_name_label_vi'
              )}
              required
            />
            <Field
              id="role"
              label={localized(
                content.role_label_en,
                content.role_label_vi,
                lang
              )}
              hint={localized(content.role_hint_en, content.role_hint_vi, lang)}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'role_label_en' : 'role_label_vi'
              )}
              required
            />
            <Field
              id="partnerName"
              label={localized(
                content.partner_name_label_en,
                content.partner_name_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en'
                  ? 'partner_name_label_en'
                  : 'partner_name_label_vi'
              )}
              required
            />
            <Field
              id="email"
              label={localized(
                content.email_label_en,
                content.email_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'email_label_en' : 'email_label_vi'
              )}
              type="email"
              required
              className="sm:col-span-2"
            />
            <Field
              id="phone"
              label={localized(
                content.phone_label_en,
                content.phone_label_vi,
                lang
              )}
              type="tel"
              hint={localized(
                content.phone_hint_en,
                content.phone_hint_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'phone_label_en' : 'phone_label_vi'
              )}
              required
            />
            <Field
              id="location"
              label={localized(
                content.location_label_en,
                content.location_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'location_label_en' : 'location_label_vi'
              )}
              required
            />
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend
            className="font-vocago text-h4 text-text-primary"
            data-tina-field={tinaField(
              content,
              lang === 'en' ? 'wedding_info_title_en' : 'wedding_info_title_vi'
            )}
          >
            {localized(
              content.wedding_info_title_en,
              content.wedding_info_title_vi,
              lang
            )}
          </legend>
          <div className="mt-5 grid gap-x-7 gap-y-5 sm:grid-cols-2">
            <Field
              id="weddingDate"
              label={localized(
                content.wedding_date_label_en,
                content.wedding_date_label_vi,
                lang
              )}
              type="date"
              cmsField={tinaField(
                content,
                lang === 'en'
                  ? 'wedding_date_label_en'
                  : 'wedding_date_label_vi'
              )}
              required
            />
            <Field
              id="venue"
              label={localized(
                content.venue_label_en,
                content.venue_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'venue_label_en' : 'venue_label_vi'
              )}
              required
            />
            <Field
              id="guestCount"
              label={localized(
                content.guest_count_label_en,
                content.guest_count_label_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'guest_count_label_en' : 'guest_count_label_vi'
              )}
              type="number"
              required
              className="sm:col-span-2"
            />
            <Field
              id="budget"
              label={localized(
                content.budget_label_en,
                content.budget_label_vi,
                lang
              )}
              hint={localized(
                content.budget_hint_en,
                content.budget_hint_vi,
                lang
              )}
              cmsField={tinaField(
                content,
                lang === 'en' ? 'budget_label_en' : 'budget_label_vi'
              )}
              required
              className="sm:col-span-2"
            />
          </div>
          <p
            className="mt-6 text-body-sm text-text-secondary"
            data-tina-field={tinaField(
              content,
              lang === 'en' ? 'extra_events_label_en' : 'extra_events_label_vi'
            )}
          >
            {localized(
              content.extra_events_label_en,
              content.extra_events_label_vi,
              lang
            )}
          </p>
          <CheckboxList
            name="extraEvents"
            options={content.event_options || []}
            lang={lang}
          />
        </fieldset>

        <fieldset className="mt-12">
          <legend
            className="font-vocago text-h4 text-text-primary"
            data-tina-field={tinaField(
              content,
              lang === 'en'
                ? 'additional_info_title_en'
                : 'additional_info_title_vi'
            )}
          >
            {localized(
              content.additional_info_title_en,
              content.additional_info_title_vi,
              lang
            )}
          </legend>
          <p
            className="mt-5 border-b border-line-primary pb-2 text-body-sm text-text-secondary"
            data-tina-field={tinaField(
              content,
              lang === 'en' ? 'referral_label_en' : 'referral_label_vi'
            )}
          >
            {localized(
              content.referral_label_en,
              content.referral_label_vi,
              lang
            )}
          </p>
          <CheckboxList
            name="referralSource"
            options={content.referral_options || []}
            lang={lang}
          />
          <div className="mt-7">
            <label
              htmlFor="otherNotes"
              className="block text-body-sm text-text-secondary"
              data-tina-field={tinaField(
                content,
                lang === 'en' ? 'other_notes_label_en' : 'other_notes_label_vi'
              )}
            >
              {localized(
                content.other_notes_label_en,
                content.other_notes_label_vi,
                lang
              )}
            </label>
            <textarea
              id="otherNotes"
              name="otherNotes"
              rows={1}
              required
              className="mt-1 w-full resize-y border-0 border-b border-line-primary bg-transparent px-0 py-2 text-body-sm text-text-primary outline-none transition-colors focus:border-text-primary focus:ring-0"
            />
            <p
              className="mt-1 whitespace-pre-line text-[11px] leading-[15px] text-text-tertiary"
              data-tina-field={tinaField(
                content,
                lang === 'en' ? 'notes_hint_en' : 'notes_hint_vi'
              )}
            >
              {localized(content.notes_hint_en, content.notes_hint_vi, lang)}
            </p>
          </div>
        </fieldset>

        {status === 'error' && (
          <p
            className="mt-6 text-center text-body-sm text-text-accent"
            data-tina-field={tinaField(
              content,
              lang === 'en' ? 'error_message_en' : 'error_message_vi'
            )}
          >
            {localized(
              content.error_message_en,
              content.error_message_vi,
              lang
            )}
          </p>
        )}

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="border-b border-line-primary px-7 pb-1 text-body-md uppercase tracking-[0.08em] text-text-primary transition-all hover:-translate-y-0.5 hover:border-text-accent hover:text-text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting'
              ? localized(
                content.sending_label_en,
                content.sending_label_vi,
                lang
              )
              : localized(content.send_label_en, content.send_label_vi, lang)}
          </button>
        </div>
      </div>
    </form>
  );
}
