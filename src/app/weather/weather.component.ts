import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, AfterViewInit {

  @Input()
  routes: any;

  @Input()
  activeRouteId: number;

  activeRoute: any;
  constructor(private elementRef:ElementRef) { }

  ngOnInit() {
    this.activeRoute = this.routes.find(r => r.id === this.activeRouteId);
  }

  ngAfterViewInit() {
    var s = document.createElement("script");
    console.log(this.activeRoute);
    s.type = "text/javascript";
    s.src = `https://darksky.net/widget/default/${this.activeRoute.ride.center[1]},${this.activeRoute.ride.center[0]}/uk12/en.js?width=100%&height=350&textColor=333333&bgColor=FFFFFF&transparency=false&skyColor=undefined&fontFamily=Default&customFont=&units=uk&htColor=333333&ltColor=C7C7C7&displaySum=yes&displayHeader=yes`;
    this.elementRef.nativeElement.appendChild(s);
  }

}
