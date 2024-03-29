import { Component, OnInit, ElementRef } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid';

interface MyParams extends IHeaderParams {
  menuIcon: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements IHeaderAngularComp {

  public params: MyParams;
  public sorted: string;
  private elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
      this.elementRef = elementRef;
  }

  agInit(params: MyParams): void {
      this.params = params;
      this.params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
      this.onSortChanged();
  }

  // ngOnDestroy() {
  //   console.log(`Destroying HeaderComponent`);
  // }

  onMenuClick() {
      this.params.showColumnMenu(this.querySelector('.customHeaderMenuButton'));
  }

  onSortRequested(order, event) {
      this.params.setSort(order, event.shiftKey);
  }

  onSortChanged() {
      if (this.params.column.isSortAscending()) {
          this.sorted = 'asc';
      } else if (this.params.column.isSortDescending()) {
          this.sorted = 'desc';
      } else {
          this.sorted = '';
      }
  }


  private querySelector(selector: string) {
      return <HTMLElement>this.elementRef.nativeElement.querySelector(
          '.customHeaderMenuButton', selector);
  }

}
