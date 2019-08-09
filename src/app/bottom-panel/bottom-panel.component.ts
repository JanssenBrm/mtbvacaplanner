import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-bottom-panel',
  templateUrl: './bottom-panel.component.html',
  styleUrls: ['./bottom-panel.component.css']
})
export class BottomPanelComponent implements OnInit, OnChanges {


  @Input()
  routes: any;

  @Input()
  activeRouteId: number;

  tab: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tab = 'overview';
  }

  setTab(name: string){
    this.tab = name;
  }

}
