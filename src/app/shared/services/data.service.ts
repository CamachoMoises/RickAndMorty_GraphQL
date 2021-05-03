/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, find, mergeMap, pluck, take, tap, withLatestFrom } from 'rxjs/operators';
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
  private episodeSubject = new BehaviorSubject<Episode[]>([]);
  episode$ = this.episodeSubject.asObservable();
  private characterSubject = new BehaviorSubject<Character[]>([]);
  character$ = this.characterSubject.asObservable();

  constructor(
    private apollo: Apollo,
    private localStoSev: LocalStorageService
  ) {
    this.getData();
  }
  getDetails(id: number): any {
    return this.character$.pipe(
      mergeMap((characters: Character[]) => characters),
      find((character: Character) => character?.id === id)
    );
  }
  public getCharactersByPage(pageNum: number): void {
    const QUERY_BY_PAGE = gql`{
      characters(page:${pageNum}) {
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
    this.apollo.watchQuery<any>({
      query: QUERY_BY_PAGE
    }).valueChanges.pipe(
      take(1),
      pluck('data', 'characters'),
      withLatestFrom(this.character$),
      tap(([apiResponce, characters]) => {
        const apiResponceR = apiResponce.results;
        console.log({ apiResponceR, characters });
        this.parseCharactersData([...characters, ...apiResponce.results]);
      })
    ).subscribe();
  }
  filterData(valueToSearch: string): void {
    const QUERY_BY_NAME = gql`
    query ($name:String) {
      characters(filter: {name: $name}){
        info{
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
    }
    `;
    this.apollo.watchQuery<any>({
      query: QUERY_BY_NAME,
      variables: {
        name: valueToSearch
      }
    }).valueChanges
      .pipe(
        take(1),
        pluck('data', 'characters'),
        tap((apiResponse) => this.parseCharactersData([...apiResponse.results])),
        catchError(error => {
          console.error(error.message);
          this.characterSubject.next(null);
          return of(error);
        })
      )
      .subscribe();
  }



  getData(): void {
    this.apollo.watchQuery<DataResponce>({ query: QUERY }).valueChanges.pipe(
      take(1),
      tap(({ data }) => {
        const { characters, episodes } = data;
        this.episodeSubject.next(episodes.results);
        this.characterSubject.next(characters.results);
        this.parseCharactersData(characters.results);
      })
    ).subscribe();
  }
  private parseCharactersData(characters: Character[]): void {
    const currentFav = this.localStoSev.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFav.find((fav: Character) => fav.id === character.id);
      return { ...character, isFavorite: found };
    });
    this.characterSubject.next(newData);
  }

}
