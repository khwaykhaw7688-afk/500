/**
 * Text-to-speech helper using the browser SpeechSynthesis API.
 * No external API or key required — uses the user's installed zh-CN voice.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickChineseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  const zh =
    voices.find((v) => v.lang.toLowerCase().startsWith("zh-cn")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ||
    null;
  cachedVoice = zh;
  return zh;
}

// Some browsers load voices asynchronously; refresh the cache when they arrive.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickChineseVoice();
  };
}

/**
 * Speak a Chinese string aloud using a zh-CN voice.
 * Returns true if speech was started, false if speech synthesis is unavailable.
 */
export function speakChinese(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.85;
  utterance.pitch = 1;

  const voice = pickChineseVoice();
  if (voice) {
    utterance.voice = voice;
  }

  synth.speak(utterance);
  return true;
}
