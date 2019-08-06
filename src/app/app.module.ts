import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {RoutesService} from "./services/routes.service";
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    RoutesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
