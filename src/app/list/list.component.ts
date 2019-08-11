import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RoutesService} from "../services/routes.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {


  @Input()
  visible: boolean;

  @Input()
  routes: any[];

  @Output()
  activateRoute: EventEmitter<number> = new EventEmitter();

  @Output()
  closeSidebar: EventEmitter<boolean> = new EventEmitter();

  filter: string;

  activeId = -1;

  constructor(private routeService: RoutesService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  setActiveRoute(id: number){
    this.activateRoute.emit(id);
    this.activeId = id;
    this.closeSidebar.emit(true);
  }

  setFilter(value: string){
    this.filter = value;
  }

  getFilteredRoutes(routes: any[]){
    return this.filter ? routes.filter(r => r.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) : routes;
  }

  closeList(){
    this.closeSidebar.emit(true);
  }

}
