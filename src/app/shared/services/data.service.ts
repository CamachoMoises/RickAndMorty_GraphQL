/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Character, Episode, DataResponce } from '@shared/interfaces/data.interface';
import { LocalStorageService } from '@shared/services/loacalStorage.service';

const QUERY = gql`{
  episodes{
    results{
      name
      episode
    }
  }
  characters {
    info {
      count
    }
    results {
      id
      name
      status
      species
      gender
      image

    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private episodeSubject = new BehaviorSubject<Episode[]>(null);
  episode$ = this.episodeSubject.asObservable();
  private characterSubject = new BehaviorSubject<Character[]>(null);
  character$ = this.characterSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private localStoSev: LocalStorageService
  ) {
    this.getData();
  }
  private getData(): void {
    this.apollo.watchQuery<DataResponce>({ query: QUERY }).valueChanges.pipe(
      take(1),
      tap(({ data }) => {
        const { characters, episodes } = data;
        this.episodeSubject.next(episodes.results);
        this.characterSubject.next(characters.results);
        this.parseCharacterData(characters.results);
      })
    ).subscribe();
  }
  private parseCharacterData(characters: Character[]): void {
    const currentFav = this.localStoSev.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFav.find((fav: Character) => fav.id === character.id);
      return { ...character, isFavorite: found };
    });
    this.characterSubject.next(newData);
  }

}
