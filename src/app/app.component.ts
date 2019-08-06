import {Component, OnInit} from '@angular/core';
import {RoutesService} from "./services/routes.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  routes: any;
  activeRouteId: number;

  constructor(private routeService: RoutesService) { }

  ngOnInit() {
    this.getRoutes();
  }

  getRoutes(){
    const routes = [];
    this.routeService.getRoutes().forEach(route => {
      routes.push(route);
    });
    this.routes = routes;
  }

  activateRoute(id: number){
    this.activeRouteId = id;
  }
}
