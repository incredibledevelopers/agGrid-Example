import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RichGridComponent } from './rich-grid/rich-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RichGridComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents(
      [
        HeaderComponent
      ]
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
