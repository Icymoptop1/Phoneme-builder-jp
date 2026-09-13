export interface Phoneme {
  symbol: string;
  label: string;
  example: string;
}

export interface PhonemeWord {
  english: string;
  phonemes: string[];
}

/*
 * HCE phoneme keyboard.
 *
 * The examples are used for mouse-over hints.
 *
 * Example:
 * /θ/ → TH (as in thin)
 */

export const phonemes: Phoneme[] = [
  { symbol: "p", label: "P", example: "P as in pet" },
  { symbol: "t", label: "T", example: "T as in tent" },
  { symbol: "k", label: "K", example: "K as in kite" },

  { symbol: "b", label: "B", example: "B as in bed" },
  { symbol: "d", label: "D", example: "D as in desk" },
  { symbol: "ɡ", label: "G", example: "G as in gift" },

  { symbol: "n", label: "N", example: "N as in net" },
  { symbol: "m", label: "M", example: "M as in milk" },
  { symbol: "ŋ", label: "NG", example: "NG as in ring" },

  { symbol: "f", label: "F", example: "F as in fan" },
  { symbol: "s", label: "S", example: "S as in sun" },
  { symbol: "θ", label: "TH", example: "TH as in thin" },
  { symbol: "ʃ", label: "SH", example: "SH as in ship" },

  { symbol: "v", label: "V", example: "V as in van" },
  { symbol: "z", label: "Z", example: "Z as in zip" },
  { symbol: "ð", label: "TH", example: "TH as in then" },
  { symbol: "ʒ", label: "ZH", example: "ZH sound" },

  { symbol: "l", label: "L", example: "L as in log" },
  { symbol: "ɹ", label: "R", example: "R as in ring" },
  { symbol: "w", label: "W", example: "W as in win" },
  { symbol: "j", label: "Y", example: "Y as in yes" },

  { symbol: "h", label: "H", example: "H as in hat" },
  { symbol: "tʃ", label: "CH", example: "CH as in chin" },
  { symbol: "dʒ", label: "J", example: "J as in jam" },

  { symbol: "iː", label: "EE", example: "EE as in scream" },
  { symbol: "ɪ", label: "I", example: "I as in ship" },
  { symbol: "e", label: "E", example: "E as in bed" },
  { symbol: "eː", label: "EE", example: "EE sound" },

  { symbol: "æ", label: "A", example: "A as in bad" },
  { symbol: "ɐ", label: "U", example: "U as in bud" },
  { symbol: "ɐː", label: "AR", example: "AR as in bark" },
  { symbol: "ɜː", label: "IR", example: "IR as in bird" },

  { symbol: "ʉː", label: "OO", example: "OO as in boot" },
  { symbol: "ɔ", label: "O", example: "O as in stop" },
  { symbol: "oː", label: "OR", example: "OR as in fork" },
  { symbol: "ʊ", label: "OO", example: "OO as in book" },

  { symbol: "æɪ", label: "AI", example: "AI as in bait" },
  { symbol: "ɑe", label: "I", example: "I as in bike" },
  { symbol: "oɪ", label: "OI", example: "OI as in boil" },
  { symbol: "əʉ", label: "O", example: "O as in boat" },

  { symbol: "æɔ", label: "OW", example: "OW as in cloud" },
  { symbol: "ɪə", label: "EAR", example: "EAR as in beard" },
  { symbol: "ə", label: "UH", example: "UH sound" },
];

/*
 * 3 phoneme words
 */

export const threePhonemeWords: PhonemeWord[] = [
  {
    english: "bed",
    phonemes: ["b", "e", "d"],
  },
  {
    english: "bid",
    phonemes: ["b", "ɪ", "d"],
  },
  {
    english: "bad",
    phonemes: ["b", "æ", "d"],
  },
  {
    english: "bud",
    phonemes: ["b", "ɐ", "d"],
  },
  {
    english: "bird",
    phonemes: ["b", "ɜː", "d"],
  },
  {
    english: "bark",
    phonemes: ["b", "ɐː", "k"],
  },
  {
    english: "book",
    phonemes: ["b", "ʊ", "k"],
  },
  {
    english: "boot",
    phonemes: ["b", "ʉː", "t"],
  },
  {
    english: "boat",
    phonemes: ["b", "əʉ", "t"],
  },
  {
    english: "bike",
    phonemes: ["b", "ɑe", "k"],
  },
  {
    english: "bait",
    phonemes: ["b", "æɪ", "t"],
  },
  {
    english: "boil",
    phonemes: ["b", "oɪ", "l"],
  },
  {
    english: "beard",
    phonemes: ["b", "ɪə", "d"],
  },
  {
    english: "choice",
    phonemes: ["tʃ", "oɪ", "s"],
  },
  {
    english: "thin",
    phonemes: ["θ", "ɪ", "n"],
  },
  {
    english: "then",
    phonemes: ["ð", "e", "n"],
  },
  {
    english: "ship",
    phonemes: ["ʃ", "ɪ", "p"],
  },
  {
    english: "chin",
    phonemes: ["tʃ", "ɪ", "n"],
  },
  {
    english: "jam",
    phonemes: ["dʒ", "æ", "m"],
  },
  {
    english: "yes",
    phonemes: ["j", "e", "s"],
  },
  {
    english: "win",
    phonemes: ["w", "ɪ", "n"],
  },
  {
    english: "ring",
    phonemes: ["ɹ", "ɪ", "ŋ"],
  },
  {
    english: "log",
    phonemes: ["l", "ɔ", "ɡ"],
  },
  {
    english: "fan",
    phonemes: ["f", "æ", "n"],
  },
  {
    english: "van",
    phonemes: ["v", "æ", "n"],
  },
  {
    english: "sun",
    phonemes: ["s", "ɐ", "n"],
  },
  {
    english: "zip",
    phonemes: ["z", "ɪ", "p"],
  },
  {
    english: "gum",
    phonemes: ["ɡ", "ɐ", "m"],
  },
  {
    english: "hat",
    phonemes: ["h", "æ", "t"],
  },
  {
    english: "fork",
    phonemes: ["f", "oː", "k"],
  },
];

/*
 * 4 phoneme words
 */

export const fourPhonemeWords: PhonemeWord[] = [
  {
    english: "stop",
    phonemes: ["s", "t", "ɔ", "p"],
  },
  {
    english: "frog",
    phonemes: ["f", "ɹ", "ɔ", "ɡ"],
  },
  {
    english: "clap",
    phonemes: ["k", "l", "æ", "p"],
  },
  {
    english: "slip",
    phonemes: ["s", "l", "ɪ", "p"],
  },
  {
    english: "drum",
    phonemes: ["d", "ɹ", "ɐ", "m"],
  },
  {
    english: "grin",
    phonemes: ["ɡ", "ɹ", "ɪ", "n"],
  },
  {
    english: "train",
    phonemes: ["t", "ɹ", "æɪ", "n"],
  },
  {
    english: "cloud",
    phonemes: ["k", "l", "æɔ", "d"],
  },
  {
    english: "snake",
    phonemes: ["s", "n", "æɪ", "k"],
  },
  {
    english: "smile",
    phonemes: ["s", "m", "ɑe", "l"],
  },
  {
    english: "milk",
    phonemes: ["m", "ɪ", "l", "k"],
  },
  {
    english: "hand",
    phonemes: ["h", "æ", "n", "d"],
  },
  {
    english: "tent",
    phonemes: ["t", "e", "n", "t"],
  },
  {
    english: "jump",
    phonemes: ["dʒ", "ɐ", "m", "p"],
  },
  {
    english: "lamp",
    phonemes: ["l", "æ", "m", "p"],
  },
  {
    english: "bank",
    phonemes: ["b", "æ", "ŋ", "k"],
  },
  {
    english: "frame",
    phonemes: ["f", "ɹ", "æɪ", "m"],
  },
  {
    english: "cold",
    phonemes: ["k", "əʉ", "l", "d"],
  },
  {
    english: "wind",
    phonemes: ["w", "ɪ", "n", "d"],
  },
  {
    english: "soft",
    phonemes: ["s", "ɔ", "f", "t"],
  },
  {
    english: "gift",
    phonemes: ["ɡ", "ɪ", "f", "t"],
  },
  {
    english: "desk",
    phonemes: ["d", "e", "s", "k"],
  },
  {
    english: "left",
    phonemes: ["l", "e", "f", "t"],
  },
  {
    english: "pond",
    phonemes: ["p", "ɔ", "n", "d"],
  },
  {
    english: "golf",
    phonemes: ["ɡ", "ɔ", "l", "f"],
  },
  {
    english: "silk",
    phonemes: ["s", "ɪ", "l", "k"],
  },
  {
    english: "great",
    phonemes: ["ɡ", "ɹ", "æɪ", "t"],
  },
  {
    english: "crab",
    phonemes: ["k", "ɹ", "æ", "b"],
  },
  {
    english: "plug",
    phonemes: ["p", "l", "ɐ", "ɡ"],
  },
  {
    english: "quiz",
    phonemes: ["k", "w", "ɪ", "z"],
  },
];

/*
 * 5 phoneme words
 */

export const fivePhonemeWords: PhonemeWord[] = [
  {
    english: "stamp",
    phonemes: ["s", "t", "æ", "m", "p"],
  },
  {
    english: "plant",
    phonemes: ["p", "l", "æ", "n", "t"],
  },
  {
    english: "blank",
    phonemes: ["b", "l", "æ", "ŋ", "k"],
  },
  {
    english: "grand",
    phonemes: ["ɡ", "ɹ", "æ", "n", "d"],
  },
  {
    english: "clamp",
    phonemes: ["k", "l", "æ", "m", "p"],
  },
  {
    english: "twist",
    phonemes: ["t", "w", "ɪ", "s", "t"],
  },
  {
    english: "trust",
    phonemes: ["t", "ɹ", "ɐ", "s", "t"],
  },
  {
    english: "drink",
    phonemes: ["d", "ɹ", "ɪ", "ŋ", "k"],
  },
  {
    english: "brisk",
    phonemes: ["b", "ɹ", "ɪ", "s", "k"],
  },
  {
    english: "shrimp",
    phonemes: ["ʃ", "ɹ", "ɪ", "m", "p"],
  },
  {
    english: "scrap",
    phonemes: ["s", "k", "ɹ", "æ", "p"],
  },
  {
    english: "scribe",
    phonemes: ["s", "k", "ɹ", "ɑe", "b"],
  },
  {
    english: "scream",
    phonemes: ["s", "k", "ɹ", "iː", "m"],
  },
  {
    english: "splash",
    phonemes: ["s", "p", "l", "æ", "ʃ"],
  },
  {
    english: "spring",
    phonemes: ["s", "p", "ɹ", "ɪ", "ŋ"],
  },
  {
    english: "strap",
    phonemes: ["s", "t", "ɹ", "æ", "p"],
  },
  {
    english: "street",
    phonemes: ["s", "t", "ɹ", "iː", "t"],
  },
  {
    english: "scrub",
    phonemes: ["s", "k", "ɹ", "ɐ", "b"],
  },
  {
    english: "flask",
    phonemes: ["f", "l", "ɐː", "s", "k"],
  },
  {
    english: "clasp",
    phonemes: ["k", "l", "ɐː", "s", "p"],
  },
  {
    english: "cleft",
    phonemes: ["k", "l", "e", "f", "t"],
  },
  {
    english: "glint",
    phonemes: ["ɡ", "l", "ɪ", "n", "t"],
  },
  {
    english: "blend",
    phonemes: ["b", "l", "e", "n", "d"],
  },
  {
    english: "strain",
    phonemes: ["s", "t", "ɹ", "æɪ", "n"],
  },
  {
    english: "thrust",
    phonemes: ["θ", "ɹ", "ɐ", "s", "t"],
  },
  {
    english: "sprawl",
    phonemes: ["s", "p", "ɹ", "oː", "l"],
  },
  {
    english: "scrawl",
    phonemes: ["s", "k", "ɹ", "oː", "l"],
  },
  {
    english: "sprig",
    phonemes: ["s", "p", "ɹ", "ɪ", "ɡ"],
  },
  {
    english: "sprout",
    phonemes: ["s", "p", "ɹ", "æɔ", "t"],
  },
  {
    english: "smoked",
    phonemes: ["s", "m", "əʉ", "k", "t"],
  },
];

/*
 * Combined word list used by the Wordle
 * and Word Search builders.
 */

export const allWords: PhonemeWord[] = [
  ...threePhonemeWords,
  ...fourPhonemeWords,
  ...fivePhonemeWords,
];