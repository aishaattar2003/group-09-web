const axios = require("axios");

// runtime cache
const translationCache = {};

async function translateText({ messageId, text, targetLang }) {
  if (!translationCache[messageId]) {
    translationCache[messageId] = {};
  }

  // return cached
  if (translationCache[messageId][targetLang]) {
    return {
      translated: translationCache[messageId][targetLang],
      cached: true
    };
  }

  // external API call
  const apiRes = await axios.post(
    "https://libretranslate.com/translate",
    {
      q: text,
      source: "auto",
      target: targetLang
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const translated = apiRes.data.translatedText;

  translationCache[messageId][targetLang] = translated;

  return {
    translated,
    cached: false
  };
}

module.exports = {
  translateText
};
