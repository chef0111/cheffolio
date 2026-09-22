import { InlineScript } from '@/components/inline-script';

/**
 * Serialized via `.toString()` into the pre-hydration script, so it must stay
 * self-contained: globals and arguments only, no module-scope references.
 * @param id The ID of the element to update with the revealed text.
 * @param text The base64-encoded text to decode and reveal.
 */
function revealEncodedText(id: string, text: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = atob(text);
}

type RevealEncodedTextProps = {
  /** The ID of the element to update with the revealed text. */
  id: string;
  /** The base64-encoded text to decode and reveal. */
  text: string;
};

/**
 * Blocking inline script that decodes the base64 text and writes it into the
 * element *before* first paint (Next.js "prevent flash before hydration").
 * The real value is therefore never present as plain text in the served HTML,
 * yet there is no flash from the client-only decode swap.
 */
export function RevealEncodedText({ id, text }: RevealEncodedTextProps) {
  return (
    <InlineScript
      html={`(${revealEncodedText.toString()})(${JSON.stringify(id)},${JSON.stringify(text)})`}
    />
  );
}
