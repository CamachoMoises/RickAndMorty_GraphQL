import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-search',
  template: `
  <section class="search__container">
  <div class="search__name">
      <label for="searchName"> Search by name ... </label>
      <input type="text" class="search__input" placeholder="Search by name..." [formControl]="search">
      <button (click)="onClear()">Clear</button>
  </div>
</section>

  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {

  search = new FormControl('');
  private destroy$ = new Subject<unknown>();
  constructor(private dataSvc: DataService) {
    this.onSearch();
  }

  onClear(): void {
    this.search.reset();
    this.dataSvc.getData();
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
  private onSearch(): void {
    this.search.valueChanges
      .pipe(
        //(toLowerCase) para minusculas
        //(trim) para quitar los espacios
        map(search => search?.toLowerCase().trim()),
        debounceTime(300),
        distinctUntilChanged(),
        filter(search => search !== '' && search?.length > 2),
        tap(search => {
          this.dataSvc.filterData(search);
          console.log(search);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

}
