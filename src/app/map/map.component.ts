import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GPX from 'ol/format/GPX.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import BingMaps from 'ol/source/BingMaps.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js'
import {RoutesService} from "../services/routes.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {


  @Input()
  routes: any;

  @Input()
  activeRouteId: number;

  map: Map;
  layers: any[];
  constructor(private routeService: RoutesService) { }

  ngOnInit() {
      this.buildMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeRouteId) {
      this.updateLayerVisibility(this.activeRouteId);
    }
  }

  buildMap(){
    const background =  new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhbWphbnNzZW4iLCJhIjoiY2prZTBvdmxnMWtuczNrbnZ5dnJobzN6NSJ9.T3w_c9JDKgmQKBNEZR2YPQ'
      })
    });

    this.layers = [];

    this.map = new Map({
      layers: [background],
      target: document.getElementById('map'),
      view: new View({
        center: [1208099.0260418092,5979680.96461715],
        zoom: 12
      })
    });

    this.routes.forEach(route => {
      const layer = route.layer;
      layer.visible = layer.id === this.activeRouteId;
      this.layers.push(route);
      this.map.addLayer(layer);
    })
  }

  updateLayerVisibility(id: number) {
    if (this.layers) {
      this.layers.forEach(l => {
        console.log(l.id);
        l.layer.setVisible(l.id === id);
        return l;
      });
    }
  }

}
