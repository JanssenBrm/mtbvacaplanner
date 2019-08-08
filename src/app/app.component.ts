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
  activeRoute: any;

  constructor(private routeService: RoutesService) { }

  ngOnInit() {
    this.getRoutes();
  }

  getRoutes(){
    this.routeService.getRoutes().subscribe(routes => {
      this.routes = routes;
      console.log(routes);
    });

  }

  activateRoute(id: number){
    this.activeRouteId = id;
    this.activeRoute = Object.assign({}, this.routes.find(r => r.id === id));
  }
}
