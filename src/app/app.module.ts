import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {RoutesService} from "./services/routes.service";
import { ListComponent } from './list/list.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { ChartComponent } from './chart/chart.component';
import {HighchartsChartModule} from "highcharts-angular";
import { BottomPanelComponent } from './bottom-panel/bottom-panel.component';
import { WeatherComponent } from './weather/weather.component';
import {LocationService} from "./services/location.service";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ListComponent,
    ChartComponent,
    BottomPanelComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HighchartsChartModule
  ],
  providers: [
    RoutesService,
    LocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
