import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  character$=this.dataScv.character$;
  constructor(private dataScv: DataService) { }

  ngOnInit(): void {}

}
