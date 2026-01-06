const axios = require("axios");
const { franc } = require("franc");

const translationCache = {};

const langMap = {
  eng: "en", // works
  fra: "fr", // works
  swe: "sv", // works
  spa: "es", // works
  deu: "de", // works
  ita: "it", // works
  rus: "ru", // works
  cmn: "zh", // works
  jpn: "ja", // works
  kor: "ko", // works
  hin: "hi", // works
  som: "so"  // works
};

let francFn;

async function detectLanguage(text) {
  if (!francFn) {
    const mod = await import("franc");
    francFn = mod.franc;
  }
  return francFn(text);
}

async function translateText({ messageId, text, target }) {
  if (!messageId || !text || !target) {
    throw new Error("Missing messageId, text, or target language");
  }

  if (!translationCache[messageId]) {
    translationCache[messageId] = {};
  }

  if (translationCache[messageId][target]) {
    return {
      translated: translationCache[messageId][target],
      cached: true,
      failed: false
    };
  }

  const detectedLang = await detectLanguage(text);
  const source = langMap[detectedLang] || "en";

  try {
    const apiRes = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${source}|${target}`
        }
      }
    );

    const translated =
      apiRes.data?.responseData?.translatedText || null;

    if (!translated || translated.trim() === "") {
      return {
        translated: text,
        cached: false,
        failed: true
      };
    }

    translationCache[messageId][target] = translated;

    return {
      translated,
      cached: false,
      failed: false
    };

  } catch (err) {
    console.error("Translation error:", err.message);
    return {
      translated: text,
      cached: false,
      failed: true
    };
  }
}

module.exports = { translateText };
