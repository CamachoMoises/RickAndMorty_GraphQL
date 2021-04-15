import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '@shared/services/spinner.services';

@Component({
  selector: 'app-spinner',
  template: `
  <div class="overlay" *ngIf="isLoading$ | async"  >
    <div class="lds-hourglass"></div>
  </div>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  isLoading$=this.spinnerService.isLoading$;
  constructor( private spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }

}
