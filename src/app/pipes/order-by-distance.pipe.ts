import { Pipe, PipeTransform } from '@angular/core';
import {RoutesService} from "../services/routes.service";

@Pipe({
  name: 'orderByDistance'
})
export class OrderByDistancePipe implements PipeTransform {

  constructor(private routeService: RoutesService) {}

  transform(routes: any[], position: number[]): any {
    let result = routes;
    if (routes && position && position.length > 0) {
      result = routes.map(r => {
        console.log(position, r.ride.start);
        r.travelDistance = this.routeService.getDistance([position, r.ride.start])
        return r;
      });
      result = result.sort((a, b) => a.travelDistance > b.travelDistance ? 1 : -1);
    }
    return result;
  }

}
