import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GPX from 'ol/format/GPX.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import BingMaps from 'ol/source/BingMaps.js';
import VectorSource from 'ol/source/Vector.js';
import XYZ from 'ol/source/XYZ.js'
import {RoutesService} from "../services/routes.service";
import {transform as transformProj} from 'ol/proj.js';
import {LocationService} from "../services/location.service";
import Feature from 'ol/Feature.js';
import {Icon, Style} from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import Overlay from 'ol/Overlay';

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

  activeRoute: any;
  map: Map;
  layers: any[];
  poiLayer: any;

  tooltip: any;
  overlay: any;

  constructor(private routeService: RoutesService, private locationService: LocationService) { }

  ngOnInit() {
      this.buildMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.activeRoute = this.routes.find(r => r.id === this.activeRouteId);
    if (changes.routes && this.routes){
      this.addLayers();
    }
    if (changes.activeRouteId) {
      this.updateLayerVisibility(this.activeRouteId);
      this.showPOIs();
    }
  }

  buildMap(){
    const background =  new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhbWphbnNzZW4iLCJhIjoiY2prZTBvdmxnMWtuczNrbnZ5dnJobzN6NSJ9.T3w_c9JDKgmQKBNEZR2YPQ'
      })
    });

    this.tooltip = document.getElementById('tooltip');
    this.overlay = new Overlay({
      element: this.tooltip,
      offset: [0, -40],
      positioning: 'top-center'
    });

    this.poiLayer = new VectorSource({features: []});
    const poiLayer = new VectorLayer({
      style: function(feature) {
        return feature.get('style');
      },
      source: this.poiLayer
    });
    this.map = new Map({
      layers: [background, poiLayer],
      target: document.getElementById('map'),
      view: new View({
        center: [1208099.0260418092,5979680.96461715],
        zoom: 4
      })
    });
    this.map.addOverlay(this.overlay);

    this.map.on('pointermove', (evt) => this.displayTooltip(evt, this.tooltip, this.overlay));


  }

  displayTooltip(evt, tooltip, overlay) {
    var pixel = evt.pixel;
    var feature = evt.map.forEachFeatureAtPixel(pixel, function(feature) {
      return feature;
    });
    tooltip.style.display = feature && feature.get('location_name') ? '' : 'none';
    if (feature) {
      overlay.setPosition(evt.coordinate);
      tooltip.innerHTML = `${feature.get('location_name')}`;
    }
  }

  addLayers(){
    this.layers = [];
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

        if(l.layer.visible) {
          this.map.getView().setCenter(transformProj(l.ride.center, 'EPSG:4326', 'EPSG:3857'));
          this.map.getView().setZoom(13);
        }
        return l;
      });
    }
  }

  showPOIs(){
    this.poiLayer.clear();
    ['parking', 'restaurant', 'cafe'].forEach(type => {
      this.getPointsOfInterest(type);
    })
  }
  getPointsOfInterest(type: string){
    this.locationService.getPointsOfInterest(this.activeRoute.ride.start[0],this.activeRoute.ride.start[1], type, 1000).subscribe((data: any[]) => {
      const features = [];
      data.forEach(f => {
        const feature = new Feature(new Point(f.location));
        feature.setProperties({
            location_name: f.name
        });
        feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
        feature.set('style', this.createStyle(`assets/${type}.png`, undefined));
        features.push(feature);
      });

      this.poiLayer.addFeatures(features);
      console.log(this.poiLayer.getFeatures());
      console.log(this.map.getLayers())

    });
  }

  createStyle(src, img) {
    return new Style({
      image: new Icon(({
        anchor: [0.5, 0.96],
        crossOrigin: 'anonymous',
        src: src,
        img: img,
        imgSize: img ? [img.width, img.height] : undefined
      }))
    });
  }

}
