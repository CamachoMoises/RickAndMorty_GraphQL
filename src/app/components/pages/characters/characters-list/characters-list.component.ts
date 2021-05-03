import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-characters-list',
  template: `
  <app-search></app-search>
  <section class="character__list"
  infiniteScroll
  (scrolled)="onScrollDown()"
  >
  <ng-container *ngIf="character$ |async as characters; else showEmpty">

  <app-characters-card
  *ngFor="let character of characters, let i=index"
  [character]="character"></app-characters-card>
  </ng-container>
  <ng-template #showEmpty>
    <div class="no__results">
      <h1 class="tittle" >Not Results</h1>
      <img src="assets/imgs/404.jpeg" alt="404">
    </div>
  </ng-template>
    <button class="button" *ngIf="showButton" (click)="onscrollTop()" type="button">⬆️</button>
  </section>
  `,
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent {
  showButton;
  character$ = this.dataScv.character$;
  private scrollHeight=500;
  private pageNum=1;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dataScv: DataService,

  ) { }

  @HostListener('window:scroll') onWindowScroll(): void {
    const yOfset = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;
    this.showButton = (yOfset || scrollTop) > this.scrollHeight;
  }
  onscrollTop(): void {
    this.document.documentElement.scrollTop=0;
  }
  onScrollDown(): void{
    this.pageNum++;
    this.dataScv.getCharactersByPage(this.pageNum);
  }

}
