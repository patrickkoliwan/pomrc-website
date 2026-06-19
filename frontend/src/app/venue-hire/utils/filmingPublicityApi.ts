import { FilmingPublicityFormData } from "./filmingPublicitySchema";

export const filmingPublicityApi = {
  async submitFilmingPublicityForm(data: FilmingPublicityFormData) {
    const response = await fetch("/api/filming-publicity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || "Failed to submit filming and publicity application"
      );
    }

    return response.json();
  },
};
