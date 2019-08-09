import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LocationService} from "../services/location.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnChanges {

  @Input()
  routes: any;

  @Input()
  activeRouteId: number;

  activeRoute: any;

  constructor(private locationService: LocationService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.activeRoute = this.routes.find(r => r.id === this.activeRouteId);

  }



}
