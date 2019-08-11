import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
import {Fill, Stroke, Icon, Style, Circle as CircleStyle, Text as TextStyle} from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import Overlay from 'ol/Overlay';
import {BACKGROUNDS} from "../config/backgrounds.config";
import {text} from "@angular/core/src/render3/instructions";

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

  @Output()
  setUserPosition: EventEmitter<number[]> = new EventEmitter();

  activeRoute: any;
  map: Map;
  layers: any[];

  poiLayers = [];
  poiTypes = [/*'parking', 'restaurant', 'cafe'*/]; // Commented for charging places api

  routeLayer: any;

  positionLayer: any;


  tooltip: any;
  overlay: any;

  constructor(private routeService: RoutesService, private locationService: LocationService) { }

  ngOnInit() {
      this.buildMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.routes) {
      this.activeRoute = this.routes.find(r => r.id === this.activeRouteId);
    }
    if (changes.routes && this.routes){
      this.addLayers();
    }
    if (changes.activeRouteId) {
      this.updateLayerVisibility(this.activeRouteId);
      this.showPOIs();
    }
  }

  buildMap(){

    const backgroundLayers = this.createBackgroundLayers();

    this.tooltip = document.getElementById('tooltip');
    this.overlay = new Overlay({
      element: this.tooltip,
      offset: [0, -40],
      positioning: 'top-center'
    });

    this.positionLayer = new VectorLayer({
      style: function(feature) {
        return feature.get('style');
      },
      source: new VectorSource({features: []}),
      zIndex: 9999
    });

    this.routeLayer = new VectorLayer({
      style: function(feature) {
        return feature.get('style');
      },
      source: new VectorSource({features: []}),
      zIndex: 999
    });
    this.routeLayer.set('name', `info_route`);
    this.routeLayer.set('title', 'Route waypoints');

    this.poiTypes.forEach(type => {
      const poiSource = new VectorSource({features: []});
      const poiLayer = new VectorLayer({
        style: function(feature) {
          return feature.get('style');
        },
        source: poiSource
      });
      poiLayer.set('name', `info_poi_${type}`);
      poiLayer.set('title', type);
      this.poiLayers.push(poiLayer);
    });

    this.map = new Map({
      layers: [...backgroundLayers, this.positionLayer, this.routeLayer, ...this.poiLayers],
      target: document.getElementById('map'),
      view: new View({
        center: [1208099.0260418092,5979680.96461715],
        zoom: 4
      })
    });
    this.map.addOverlay(this.overlay);
    this.map.on('pointermove', (evt) => this.displayTooltip(evt, this.tooltip, this.overlay));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.positionLayer.getSource().clear();
        const feature = this.createFeature('User location', [position.coords.longitude, position.coords.latitude], 'position');
        this.positionLayer.getSource().addFeature(feature);
        this.setUserPosition.emit([position.coords.longitude, position.coords.latitude]);
      });
    }


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
        l.layer.setVisible(l.id === id);

        if(l.layer.getVisible()) {
          this.map.getView().setZoom(13);
          this.map.getView().setCenter(transformProj(l.ride.center, 'EPSG:4326', 'EPSG:3857'));
        }
        return l;
      });
    }
  }

  showPOIs(){
    if (this.poiLayers.length > 0) {

      this.poiLayers.forEach(l => l.getSource().clear());

      if (this.activeRoute.pois.length === 0) {
        this.poiTypes.forEach(type => {
          this.getPointsOfInterest(type);
        });
      } else {
        this.poiTypes.forEach(type => {
          this.getPOISource(type).addFeatures(this.activeRoute.pois.filter(p => p.type === type).map(p => this.createFeature(p.name, p.location, p.type)));
        });
      }
    }

    if (this.activeRoute){
      const features = this.activeRoute.ride.routepois.map(p => this.createFeature(p.name, p.location, p.type));
      this.routeLayer.getSource().clear();
      this.routeLayer.getSource().addFeatures(features);
    }
  }
  getPointsOfInterest(type: string){
    this.locationService.getPointsOfInterest(this.activeRoute.ride.start[0],this.activeRoute.ride.start[1], type, 2000).subscribe((data: any[]) => {
      const features = [];
      data.forEach(f => {
        const feature = this.createFeature(f.name, f.location, type);
        features.push(feature);
      });
      this.activeRoute.pois = [...this.activeRoute.pois, ...data];
      this.getPOISource(type).addFeatures(features);
    });
  }

  getPOISource(type){
    return this.poiLayers.find(l => l.get('name').indexOf(type) >= 0).getSource();
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

  createPointStyle(name) {

    const textColor = '#00A2FF';

    return new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({color: 'rgba(255, 255, 255, 1)'}),
        stroke: new Stroke({color: textColor, width: 3})
      }),
      text: new TextStyle({
        text: name,
        fill: new Fill({color: textColor}),
      })
    });
  }

  createPositionStyle() {

    const textColor = '#00A2FF';
    return new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({color: textColor}),
        stroke: new Stroke({color: 'rgb(255,255,255)', width: 2})
      }),
    });
  }

  createFeature(name, location, type){
    const feature = new Feature(new Point(location));
    feature.setProperties({
      location_name: name
    });
    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

    if (type === 'position'){
      feature.set('style', this.createPositionStyle());
    } else if(type !== 'point') {
      feature.set('style', this.createStyle(`assets/${type}.png`, undefined));
    } else {
      feature.set('style', this.createPointStyle(name));
    }

    return feature
  }

  createBackgroundLayers(){

    const layers = [];

    BACKGROUNDS.forEach((config: any) => {
      config.layer.set('name', config.name);
      config.layer.set('title', config.title);
      config.layer.setVisible(false);
      layers.push(config.layer);
    });

    layers[0].setVisible(true);

    return layers;
  }
}
