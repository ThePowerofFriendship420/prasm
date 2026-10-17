/**
 * Send a form to Formspree from the browser and report whether it arrived.
 * Formspree must have reCAPTCHA turned off for fetch submissions (its default
 * reCAPTCHA rejects them); see .env.local.example.
 */
export async function submitForm(
  endpoint: string,
  fields: Record<string, string>,
): Promise<boolean> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** A mailto: link with a subject and body, for when no form service is set. */
export function mailtoLink(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
