'use client';

import { type FormEvent, type Ref, useState } from 'react';
import { contact } from '@/data/site';

type Field = 'name' | 'email' | 'message' | 'agree';
type Note = { text: string; error: boolean } | null;

/**
 * Name / email / message + consent. Uses native validity for the rules, shows inline error
 * states, and posts to `contact.endpoint` when one is configured.
 */
export function ContactForm({ ref }: { ref?: Ref<HTMLFormElement> }) {
  const [bad, setBad] = useState<Partial<Record<Field, boolean>>>({});
  const [note, setNote] = useState<Note>(null);
  const [sending, setSending] = useState(false);

  // once a field is flagged, clear the flag as soon as it becomes valid
  const revalidate = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as HTMLInputElement;
    const name = el.name as Field;
    if (bad[name] && el.checkValidity()) setBad((b) => ({ ...b, [name]: false }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    const flags: Partial<Record<Field, boolean>> = {};
    let first: HTMLInputElement | HTMLTextAreaElement | null = null;
    for (const el of fields) {
      const ok = el.checkValidity();
      flags[el.name as Field] = !ok;
      if (!ok && !first) first = el;
    }
    setBad(flags);
    if (first) {
      const isConsent = first.type === 'checkbox';
      const isEmail = first.type === 'email' && !!first.value;
      setNote({ text: isConsent ? contact.messages.consent : isEmail ? contact.messages.email : contact.messages.missing, error: true });
      first.focus();
      return;
    }
    setNote(null);
    setSending(true);
    try {
      if (contact.endpoint) {
        const res = await fetch(contact.endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
        if (!res.ok) throw new Error(String(res.status));
      }
      setNote({ text: contact.messages.sent, error: false });
      form.reset();
    } catch {
      setNote({ text: contact.messages.failed, error: true });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="ct-form" id="ct-form" noValidate ref={ref} onSubmit={onSubmit} onInput={revalidate} onChange={revalidate}>
      <div className="ct-row">
        <label className={bad.name ? 'ct-f bad' : 'ct-f'}>
          <span className="sr">Name</span>
          <input id="ct-name" name="name" type="text" placeholder="Name" autoComplete="name" required />
        </label>
        <label className={bad.email ? 'ct-f bad' : 'ct-f'}>
          <span className="sr">Email</span>
          <input id="ct-email" name="email" type="email" placeholder="Email" autoComplete="email" required />
        </label>
      </div>
      <label className={bad.message ? 'ct-f ct-msg bad' : 'ct-f ct-msg'}>
        <span className="sr">Message</span>
        <textarea id="ct-message" name="message" placeholder="Write a message..." required />
      </label>
      <label className={bad.agree ? 'ct-check bad' : 'ct-check'}>
        <input id="ct-agree" name="agree" type="checkbox" required />
        <span className="ct-box" aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <path d="M2.5 6.2 5 8.6l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>I read and agree with Privacy Policies</span>
      </label>
      <button className="ct-submit" type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Submit'}
      </button>
      <p className={note?.error ? 'ct-note err' : 'ct-note'} role="status" aria-live="polite">
        {note?.text}
      </p>
    </form>
  );
}
