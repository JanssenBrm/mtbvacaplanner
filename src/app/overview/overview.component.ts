import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {RoutesService} from "../services/routes.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnChanges {


  @Input()
  activeRoute: any;

  @Input()
  pois: any[];

  poiCats: any[];

  constructor(private routeService: RoutesService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.poiCats = this.getPOIs(this.pois);
  }

  getHours(time: string){
    const hours = +time.split(':')[0];
    const minutes = +time.split(':')[1];

    return hours + (minutes / 60);
  }

  getAverageSpeed(){
    return Math.round((this.activeRoute.ride.distance / this.getHours(this.activeRoute.ride.duration)) * 10) / 10
  }

  getPOIs(pois: any[]){
    const result = [];
    pois.forEach(poi => {
      let poiCollection = result.find(p => p.type === poi.type);
      if (!poiCollection) {
        poiCollection = { type: poi.type, places: []};
        result.push(poiCollection);
      }
      poiCollection.places.push(poi.name);
    });
    return result;
  }

  downloadRoute(){
    this.routeService.downloadRoute(this.activeRoute.name.trim().replace(/\s+/g, '_'), this.activeRoute.path);
  }
}

