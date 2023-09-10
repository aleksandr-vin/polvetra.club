import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AttendeesListComponent } from './attendees-list/attendees-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AttendeesListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
