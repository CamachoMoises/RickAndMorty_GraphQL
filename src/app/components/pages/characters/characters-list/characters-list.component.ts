import { Component } from '@angular/core';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-characters-list',
  template: `
  <section class="character__list" >
    <app-characters-card *ngFor="let character of character$|async" [character]="character"></app-characters-card>
  </section>
  `,
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent {
  character$=this.dataScv.character$;
  constructor(private dataScv: DataService) { }

}
