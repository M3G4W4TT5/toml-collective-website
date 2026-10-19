export type MailEnv = Partial<Pick<WorkerEnv,
  'CONTACT_PROVIDER' | 'CONTACT_RECIPIENT' | 'CONTACT_SENDER' | 'RESEND_API_KEY'
  | 'CF_EMAIL_ACCOUNT_ID' | 'CF_EMAIL_API_TOKEN'
>>;

export type ContactMessage = { name: string; email: string; message: string };

export interface MailProvider {
  send(message: ContactMessage): Promise<boolean>;
}

const address = (value: string | undefined): boolean =>
  Boolean(value && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value));

const resendSender = (value: string | undefined): boolean => {
  if (address(value)) return true;
  if (!value || value.length > 320) return false;
  const match = /^([^\r\n<>]{1,100}) <([^<>]+)>$/.exec(value);
  return Boolean(match && match[1].trim() && address(match[2]));
};

function plainText(data: ContactMessage): string {
  return `New website enquiry\n\nName: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
}

function resend(env: MailEnv): MailProvider | null {
  if (!env.RESEND_API_KEY || !address(env.CONTACT_RECIPIENT) || !resendSender(env.CONTACT_SENDER)) return null;
  return {
    async send(data) {
      const reply = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.CONTACT_SENDER,
          to: [env.CONTACT_RECIPIENT],
          reply_to: data.email,
          subject: 'Website enquiry',
          text: plainText(data),
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!reply.ok) return false;
      const result = await reply.json() as { id?: string };
      return typeof result.id === 'string' && result.id.length > 0;
    },
  };
}

function cloudflare(env: MailEnv): MailProvider | null {
  if (!env.CF_EMAIL_ACCOUNT_ID || !env.CF_EMAIL_API_TOKEN || !address(env.CONTACT_RECIPIENT) || !address(env.CONTACT_SENDER)) return null;
  return {
    async send(data) {
      const reply = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CF_EMAIL_ACCOUNT_ID!)}/email/sending/send`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.CF_EMAIL_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.CONTACT_SENDER,
          to: env.CONTACT_RECIPIENT,
          reply_to: data.email,
          subject: 'Website enquiry',
          text: plainText(data),
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!reply.ok) return false;
      const result = await reply.json() as {
        success?: boolean;
        result?: { delivered?: string[]; queued?: string[]; permanent_bounces?: string[]; suppressed_recipients?: string[] };
      };
      const accepted = [...(result.result?.delivered || []), ...(result.result?.queued || [])];
      return result.success === true
        && accepted.includes(env.CONTACT_RECIPIENT!)
        && !result.result?.permanent_bounces?.length
        && !result.result?.suppressed_recipients?.length;
    },
  };
}

export function createMailProvider(env: MailEnv): MailProvider | null {
  if (!env.CONTACT_PROVIDER || env.CONTACT_PROVIDER === 'resend') return resend(env);
  if (env.CONTACT_PROVIDER === 'cloudflare') return cloudflare(env);
  return null;
}
