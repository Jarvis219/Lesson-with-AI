export interface IPASymbol {
  symbol: string;
  example: string;
  type: "vowel" | "consonant" | "diphthong";
  description: string;
}

export interface IPAData {
  vowels: IPASymbol[];
  consonants: IPASymbol[];
  diphthongs: IPASymbol[];
}

