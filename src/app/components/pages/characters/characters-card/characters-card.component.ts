import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Character } from '@shared/interfaces/data.interface';
import { LocalStorageService } from '@shared/services/loacalStorage.service';

@Component({
  selector: 'app-characters-card',
  templateUrl: './characters-card.component.html',
  styleUrls: ['./characters-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersCardComponent {
  @Input() character: Character ;
  constructor(
    private localStoServ: LocalStorageService
    ) {}
  getIcon(): string {
    console.log();
    return this.character.isFavorite ? 'heart-solid.svg' : 'heart.svg';
  }
  toggleFavorite(): void{
   const isFavorite = this.character.isFavorite;
   this.getIcon();
    this.character.isFavorite=!isFavorite;
    this.localStoServ.addoOrRemoveFavorite(this.character);
  }

}
