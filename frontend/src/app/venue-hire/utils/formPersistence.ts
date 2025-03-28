const FORM_STORAGE_KEY = "venue-hire-form-data";

export const formStorage = {
  save: (data: any) => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  },

  load: () => {
    try {
      const data = localStorage.getItem(FORM_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading form data:", error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing form data:", error);
    }
  },
};
