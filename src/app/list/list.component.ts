import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input()
  routes: any[];

  @Output()
  activateRoute: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setActiveRoute(id: number){
    this.activateRoute.emit(id);
  }


}
