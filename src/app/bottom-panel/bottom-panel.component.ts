import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-bottom-panel',
  templateUrl: './bottom-panel.component.html',
  styleUrls: ['./bottom-panel.component.css'],
  animations: [
    trigger('changeDivSize', [
      state('contentUp', style({
        height: '40vh'
      })),
      state('contentDown', style({
        height: 'auto'
      }))
    ]),
  ]
})
export class BottomPanelComponent implements OnInit, OnChanges {


  @Input()
  routes: any;

  @Input()
  activeRouteId: number;

  tab: string;
  state = 'contentUp';

  activeRoute: any;

  @ViewChild('content') contentView: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tab = 'overview';
    this.activeRoute = this.routes.find(r => r.id === this.activeRouteId);
  }

  setTab(name: string){
    this.tab = name;
    this.state = 'contentUp';
  }

  toggleContent(){
    this.state = this.state === 'contentUp' ? 'contentDown' : 'contentUp';
  }

}
