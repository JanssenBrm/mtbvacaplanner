import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RoutesService} from "../services/routes.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {


  @Input()
  routes: any[];

  @Output()
  activateRoute: EventEmitter<number> = new EventEmitter();


  constructor(private routeService: RoutesService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  setActiveRoute(id: number){
    this.activateRoute.emit(id);
  }


}
