import {
  FilmingPublicityFormData,
  filmingPublicityDefaultValues,
} from "./filmingPublicitySchema";

const FORM_STORAGE_KEY = "filming-publicity-form-data";

export const filmingFormStorage = {
  save: (data: Partial<FilmingPublicityFormData>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    }
  },

  load: (): FilmingPublicityFormData | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as FilmingPublicityFormData;
    } catch {
      return null;
    }
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
  },

  getDefaults: (): FilmingPublicityFormData => filmingPublicityDefaultValues,
};
