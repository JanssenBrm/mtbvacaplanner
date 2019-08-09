import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {


  @Input()
  routes: any;

  @Input()
  activeRouteId: number;

  route: any;

  updateFlag: boolean;


  @ViewChild('chartTarget') chartTarget: ElementRef;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  chart: Highcharts.Chart;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.routes && this.routes.length > 0) {
      this.setSeries();
    }

    this.route = this.routes.find(r => r.id == this.activeRouteId);
    if (this.route) {
      this.setActiveRoute();
    }
  }

  ngOnInit() {

  }

  setSeries() {
    this.chartOptions.series = [];
    this.routes.forEach(r => {
      this.chartOptions.series.push(
        {
          name: r.id,
          data: r.ride.heightProfile,
          type: 'line',
          showInLegend: false,
        });
    });

    this.chartOptions.tooltip = {
      formatter: function () {
        console.log(this.x);
        const distance = Math.round(this.x * 10) / 10;
        const height = Math.round(this.y);
        return 'Distance: <b>' + distance +
          'km</b><br/>Height: <b>' + height + 'm</b>';
      }
    }
  }

  chartCreated(chart) {
    console.log("CHART CREATED", chart);
    this.chart = chart;
  }

  setActiveRoute() {
    this.chartOptions.series.forEach(s => {
        s.visible = +s.name === this.activeRouteId
    });
    this.updateFlag = true;

  }

}
