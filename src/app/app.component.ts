import {Component, OnInit} from '@angular/core';
import {RoutesService} from "./services/routes.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  routes: any;
  activeRouteId: number;
  activeRoute: any;

  sidebar = true;

  userPosition = [];

  constructor(private routeService: RoutesService) { }

  ngOnInit() {
    this.getRoutes();
  }

  getRoutes(){
    this.routeService.getRoutes().subscribe(routes => {
      this.routes = routes;
    });

  }

  activateRoute(id: number){
    this.activeRouteId = id;
    this.activeRoute = Object.assign({}, this.routes.find(r => r.id === id));
  }

  toggleSidebar(state){

    if (state === undefined) {
      this.sidebar = !this.sidebar;
    } else {
      this.sidebar = state;
    }
  }

  setUserPosition(position: number[]){
    this.userPosition = position;
  }

}
