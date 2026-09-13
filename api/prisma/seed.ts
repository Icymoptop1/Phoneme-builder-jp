import { prisma } from "../../lib/prisma";

type SeedWord = {
  english: string;
  phonemes: string[];
};

type SeedWordList = {
  name: string;
  description: string;
  words: SeedWord[];
};

const threePhonemeWords: SeedWord[] = [
  { english: "bed", phonemes: ["b", "e", "d"] },
  { english: "bid", phonemes: ["b", "ɪ", "d"] },
  { english: "bad", phonemes: ["b", "æ", "d"] },
  { english: "bud", phonemes: ["b", "ɐ", "d"] },
  { english: "bird", phonemes: ["b", "ɜː", "d"] },
  { english: "bark", phonemes: ["b", "ɐː", "k"] },
  { english: "book", phonemes: ["b", "ʊ", "k"] },
  { english: "boot", phonemes: ["b", "ʉː", "t"] },
  { english: "boat", phonemes: ["b", "əʉ", "t"] },
  { english: "bike", phonemes: ["b", "ɑe", "k"] },
  { english: "bait", phonemes: ["b", "æɪ", "t"] },
  { english: "boil", phonemes: ["b", "oɪ", "l"] },
  { english: "beard", phonemes: ["b", "ɪə", "d"] },
  { english: "choice", phonemes: ["tʃ", "oɪ", "s"] },
  { english: "thin", phonemes: ["θ", "ɪ", "n"] },
  { english: "then", phonemes: ["ð", "e", "n"] },
  { english: "ship", phonemes: ["ʃ", "ɪ", "p"] },
  { english: "chin", phonemes: ["tʃ", "ɪ", "n"] },
  { english: "jam", phonemes: ["dʒ", "æ", "m"] },
  { english: "yes", phonemes: ["j", "e", "s"] },
  { english: "win", phonemes: ["w", "ɪ", "n"] },
  { english: "ring", phonemes: ["ɹ", "ɪ", "ŋ"] },
  { english: "log", phonemes: ["l", "ɔ", "ɡ"] },
  { english: "fan", phonemes: ["f", "æ", "n"] },
  { english: "van", phonemes: ["v", "æ", "n"] },
  { english: "sun", phonemes: ["s", "ɐ", "n"] },
  { english: "zip", phonemes: ["z", "ɪ", "p"] },
  { english: "gum", phonemes: ["ɡ", "ɐ", "m"] },
  { english: "hat", phonemes: ["h", "æ", "t"] },
  { english: "fork", phonemes: ["f", "oː", "k"] },
];

const fourPhonemeWords: SeedWord[] = [
  { english: "stop", phonemes: ["s", "t", "ɔ", "p"] },
  { english: "frog", phonemes: ["f", "ɹ", "ɔ", "ɡ"] },
  { english: "clap", phonemes: ["k", "l", "æ", "p"] },
  { english: "slip", phonemes: ["s", "l", "ɪ", "p"] },
  { english: "drum", phonemes: ["d", "ɹ", "ɐ", "m"] },
  { english: "grin", phonemes: ["ɡ", "ɹ", "ɪ", "n"] },
  { english: "train", phonemes: ["t", "ɹ", "æɪ", "n"] },
  { english: "cloud", phonemes: ["k", "l", "æɔ", "d"] },
  { english: "snake", phonemes: ["s", "n", "æɪ", "k"] },
  { english: "smile", phonemes: ["s", "m", "ɑe", "l"] },
  { english: "milk", phonemes: ["m", "ɪ", "l", "k"] },
  { english: "hand", phonemes: ["h", "æ", "n", "d"] },
  { english: "tent", phonemes: ["t", "e", "n", "t"] },
  { english: "jump", phonemes: ["dʒ", "ɐ", "m", "p"] },
  { english: "lamp", phonemes: ["l", "æ", "m", "p"] },
  { english: "bank", phonemes: ["b", "æ", "ŋ", "k"] },
  { english: "frame", phonemes: ["f", "ɹ", "æɪ", "m"] },
  { english: "cold", phonemes: ["k", "əʉ", "l", "d"] },
  { english: "wind", phonemes: ["w", "ɪ", "n", "d"] },
  { english: "soft", phonemes: ["s", "ɔ", "f", "t"] },
  { english: "gift", phonemes: ["ɡ", "ɪ", "f", "t"] },
  { english: "desk", phonemes: ["d", "e", "s", "k"] },
  { english: "left", phonemes: ["l", "e", "f", "t"] },
  { english: "pond", phonemes: ["p", "ɔ", "n", "d"] },
  { english: "golf", phonemes: ["ɡ", "ɔ", "l", "f"] },
  { english: "silk", phonemes: ["s", "ɪ", "l", "k"] },
  { english: "great", phonemes: ["ɡ", "ɹ", "æɪ", "t"] },
  { english: "crab", phonemes: ["k", "ɹ", "æ", "b"] },
  { english: "plug", phonemes: ["p", "l", "ɐ", "ɡ"] },
  { english: "quiz", phonemes: ["k", "w", "ɪ", "z"] },
];

const fivePhonemeWords: SeedWord[] = [
  { english: "stamp", phonemes: ["s", "t", "æ", "m", "p"] },
  { english: "plant", phonemes: ["p", "l", "æ", "n", "t"] },
  { english: "blank", phonemes: ["b", "l", "æ", "ŋ", "k"] },
  { english: "grand", phonemes: ["ɡ", "ɹ", "æ", "n", "d"] },
  { english: "clamp", phonemes: ["k", "l", "æ", "m", "p"] },
  { english: "twist", phonemes: ["t", "w", "ɪ", "s", "t"] },
  { english: "trust", phonemes: ["t", "ɹ", "ɐ", "s", "t"] },
  { english: "drink", phonemes: ["d", "ɹ", "ɪ", "ŋ", "k"] },
  { english: "brisk", phonemes: ["b", "ɹ", "ɪ", "s", "k"] },
  { english: "shrimp", phonemes: ["ʃ", "ɹ", "ɪ", "m", "p"] },
  { english: "scrap", phonemes: ["s", "k", "ɹ", "æ", "p"] },
  { english: "scribe", phonemes: ["s", "k", "ɹ", "ɑe", "b"] },
  { english: "scream", phonemes: ["s", "k", "ɹ", "iː", "m"] },
  { english: "splash", phonemes: ["s", "p", "l", "æ", "ʃ"] },
  { english: "spring", phonemes: ["s", "p", "ɹ", "ɪ", "ŋ"] },
  { english: "strap", phonemes: ["s", "t", "ɹ", "æ", "p"] },
  { english: "street", phonemes: ["s", "t", "ɹ", "iː", "t"] },
  { english: "scrub", phonemes: ["s", "k", "ɹ", "ɐ", "b"] },
  { english: "flask", phonemes: ["f", "l", "ɐː", "s", "k"] },
  { english: "clasp", phonemes: ["k", "l", "ɐː", "s", "p"] },
  { english: "cleft", phonemes: ["k", "l", "e", "f", "t"] },
  { english: "glint", phonemes: ["ɡ", "l", "ɪ", "n", "t"] },
  { english: "blend", phonemes: ["b", "l", "e", "n", "d"] },
  { english: "strain", phonemes: ["s", "t", "ɹ", "æɪ", "n"] },
  { english: "thrust", phonemes: ["θ", "ɹ", "ɐ", "s", "t"] },
  { english: "sprawl", phonemes: ["s", "p", "ɹ", "oː", "l"] },
  { english: "scrawl", phonemes: ["s", "k", "ɹ", "oː", "l"] },
  { english: "sprig", phonemes: ["s", "p", "ɹ", "ɪ", "ɡ"] },
  { english: "sprout", phonemes: ["s", "p", "ɹ", "æɔ", "t"] },
  { english: "smoked", phonemes: ["s", "m", "əʉ", "k", "t"] },
];

const seedLists: SeedWordList[] = [
  {
    name: "3 Phoneme Words",
    description: "HCE Wordle corpus: 30 words containing three phonemes.",
    words: threePhonemeWords,
  },
  {
    name: "4 Phoneme Words",
    description: "HCE Wordle corpus: 30 words containing four phonemes.",
    words: fourPhonemeWords,
  },
  {
    name: "5 Phoneme Words",
    description: "HCE Wordle corpus: 30 words containing five phonemes.",
    words: fivePhonemeWords,
  },
];

async function getOrCreateWord(seedWord: SeedWord) {
  const phonemesJson = JSON.stringify(seedWord.phonemes);

  const existingWord = await prisma.word.findFirst({
    where: {
      english: seedWord.english,
      phonemes: phonemesJson,
    },
  });

  if (existingWord) {
    return existingWord;
  }

  return prisma.word.create({
    data: {
      english: seedWord.english,
      phonemes: phonemesJson,
      hint: null,
    },
  });
}

async function getOrCreateWordList(seedList: SeedWordList) {
  const existingList = await prisma.wordList.findFirst({
    where: {
      name: seedList.name,
    },
  });

  if (existingList) {
    return prisma.wordList.update({
      where: {
        id: existingList.id,
      },
      data: {
        description: seedList.description,
      },
    });
  }

  return prisma.wordList.create({
    data: {
      name: seedList.name,
      description: seedList.description,
    },
  });
}

async function linkWordToList(wordId: number, wordListId: number) {
  const existingLink = await prisma.wordListWord.findFirst({
    where: {
      wordId,
      wordListId,
    },
  });

  if (existingLink) {
    return;
  }

  await prisma.wordListWord.create({
    data: {
      wordId,
      wordListId,
    },
  });
}

async function main() {
  console.log("Starting HCE phoneme corpus seed...");

  for (const seedList of seedLists) {
    const wordList = await getOrCreateWordList(seedList);

    console.log(
      `Processing "${seedList.name}" (${seedList.words.length} words)...`
    );

    for (const seedWord of seedList.words) {
      const word = await getOrCreateWord(seedWord);

      await linkWordToList(word.id, wordList.id);
    }
  }

  console.log("Seed complete.");
  console.log(`Total words in database: ${await prisma.word.count()}`);
  console.log(`Total word lists in database: ${await prisma.wordList.count()}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
