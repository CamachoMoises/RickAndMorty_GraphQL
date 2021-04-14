import { Component } from '@angular/core';
import { LocalStorageService } from '@shared/services/loacalStorage.service';

@Component({
  selector: 'app-home',
  template: `
  <section class="character__list" >
    <app-characters-card *ngFor="let character of characterFav$|async" [character]="character"></app-characters-card>
  </section>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  characterFav$=this.localStoServ.charactersFav$ ;
  constructor(
    private localStoServ: LocalStorageService
  ) { }

}
