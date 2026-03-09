export const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const NUMBER_SIZES = Array.from({ length: 46 - 26 + 1 }, (_, i) => (26 + i).toString());

export const ALL_SIZES = [...LETTER_SIZES, ...NUMBER_SIZES];

export type LetterSize = typeof LETTER_SIZES[number];
export type NumberSize = string;
export type ProductSize = LetterSize | NumberSize;
