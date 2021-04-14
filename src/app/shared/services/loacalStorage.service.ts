/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Character } from '@shared/interfaces/data.interface';
import { BehaviorSubject } from 'rxjs';

const MY_FAVORITES = 'myFavorites';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private characterFavSubjet = new BehaviorSubject<Character[]>(null);
  charactersFav$ = this.characterFavSubjet.asObservable();
  constructor() {
    this.incialStorage();
  }

  addoOrRemoveFavorite(character: Character): void {
    const { id } = character;
    const currentsFav = this.getFavoritesCharacters();
    const found = !!currentsFav.find((fav: Character) => fav.id === id);
    found ? this.removeFromFavorite(id) : this.addToFavorite(character);
  }
  private addToFavorite(character: Character): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...currentsFav, character]));
      this.characterFavSubjet.next([...currentsFav, character]);
    } catch (error) {
      console.log('Error saving localStorege', error);
      alert('Error');
    }
  }
  private removeFromFavorite(id: number): void {
    try {
      const currentsFav = this.getFavoritesCharacters();
      const characters= currentsFav.filter(item=> item.id !== id);
      localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
      this.characterFavSubjet.next([...characters]);
    } catch (error) {
      console.log('Error removing localStorege', error);
      alert('Error');
    }
  }

  getFavoritesCharacters(): Character[] {
    try {
      const charactersFav: Character[] = JSON.parse(localStorage.getItem(MY_FAVORITES));
      this.characterFavSubjet.next(charactersFav);
      return charactersFav;
    } catch (error) {
      console.log('Error getting favorite from localStorege', error);
    }

  }
  clearStorage(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.log('Error cleanig localStorage', error);
    }
  }
  private incialStorage(): void {
    const current = JSON.parse(localStorage.getItem(MY_FAVORITES));
    if (!current) {
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
    }
    this.getFavoritesCharacters();
  }
}
