import type { PhonemeWord } from "../data/phonemes";

export interface PlacedWord {
  word: PhonemeWord;
  cells: string[];
}

export interface WordSearchPuzzle {
  grid: string[][];
  words: PhonemeWord[];
  placements: PlacedWord[];
}

const directions: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

function canPlace(
  grid: string[][],
  phonemes: string[],
  startRow: number,
  startCol: number,
  rowDirection: number,
  colDirection: number
): boolean {
  const size = grid.length;

  for (let index = 0; index < phonemes.length; index++) {
    const row =
      startRow + rowDirection * index;

    const col =
      startCol + colDirection * index;

    if (
      row < 0 ||
      row >= size ||
      col < 0 ||
      col >= size
    ) {
      return false;
    }

    const existing = grid[row][col];

    if (
      existing !== "" &&
      existing !== phonemes[index]
    ) {
      return false;
    }
  }

  return true;
}

export function generateWordSearch(
  size: number,
  words: PhonemeWord[],
  fillerPhonemes: string[]
): WordSearchPuzzle {
  const grid: string[][] =
    Array.from(
      { length: size },
      () => Array(size).fill("")
    );

  const placements: PlacedWord[] = [];

  for (const word of shuffle(words)) {
    let placed = false;

    for (const [rowDirection, colDirection] of shuffle(directions)) {
      if (placed) break;

      const positions: [number, number][] = [];

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          positions.push([row, col]);
        }
      }

      for (const [startRow, startCol] of shuffle(positions)) {
        if (
          !canPlace(
            grid,
            word.phonemes,
            startRow,
            startCol,
            rowDirection,
            colDirection
          )
        ) {
          continue;
        }

        const cells: string[] = [];

        word.phonemes.forEach(
          (phoneme, index) => {
            const row =
              startRow +
              rowDirection * index;

            const col =
              startCol +
              colDirection * index;

            grid[row][col] = phoneme;
            cells.push(cellKey(row, col));
          }
        );

        placements.push({
          word,
          cells,
        });

        placed = true;
        break;
      }
    }
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === "") {
        grid[row][col] =
          fillerPhonemes[
            Math.floor(
              Math.random() *
              fillerPhonemes.length
            )
          ];
      }
    }
  }

  return {
    grid,
    words: placements.map(
      (placement) => placement.word
    ),
    placements,
  };
}