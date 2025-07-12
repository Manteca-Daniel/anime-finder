export type Anime = {
    mal_id: number;
    title: string;
    title_english?: string;
    title_synonyms?: string[];
    synopsis: string;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    score: number;
    rank: number;
    popularity: number;
    type: string;
    episodes: number;
    status: string;
    year: number;
  };
  