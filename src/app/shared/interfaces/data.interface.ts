
export interface APIResponce<T>{
  results: T;
}

export interface DataResponce{
  characters: APIResponce<Character[]>;
  episodes: APIResponce<Episode[]>;
}

export interface Episode {
  name: string;
  episode: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  isFavorite?: boolean;
}
