import { Injectable } from '@angular/core';
import {ROUTES} from "../config/routes.config";
import GPX from 'ol/format/GPX.js';
import VectorSource from 'ol/source/Vector.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import {transform as transformProj} from 'ol/proj.js';
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import * as parser from "xml2json";
import * as _ from 'lodash';
import {forkJoin} from "rxjs/observable/forkJoin";
import * as moment from 'moment';
import * as turf from '@turf/turf';

@Injectable()
export class RoutesService {

  constructor(private http: HttpClient) { }


  geographic = "EPSG:4326";
  mercator = "EPSG:900913";

  styles =  {
    'Point': new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: 'rgba(255,255,0,0.4)'
        }),
        radius: 5,
        stroke: new Stroke({
          color: '#ff0',
          width: 1
        })
      })
    }),
    'LineString': new Style({
      stroke: new Stroke({
        color: '#f00',
        width: 3
      })
    }),
    'MultiLineString': new Style({
      stroke: new Stroke({
        color: '#f00',
        width: 4
      })
    })
  };

  getRoutes(): Observable<any[]>{
    let id = 0;

    const observables = [];


    ROUTES.forEach((route, idx) => {
      observables.push(this.getRoute(idx, route));
    });

    return forkJoin(observables);

  }

  private getRoute(id, route): Observable<any>{

    const layer = new VectorLayer({
      source: new VectorSource({
        url: route.path,
        format: new GPX()
      }),
      style: (feature) => this.styles[feature.getGeometry().getType()],
      visible: false
    });


    const routeObject =
    {
      id: id,
      path: route.path,
      layer: layer,
      active: false,
    };


    const parser = new DOMParser();
    return this.http.get(route.path, {responseType: 'text'}).pipe(
      map(data => {
        const obj = parser.parseFromString(data, 'text/xml');
        console.log(obj);
        const name = obj.getElementsByTagName("metadata")[0].getElementsByTagName("name")[0].textContent
          .replace('GPX Download:', '');

        const ride = this.getRideInfo([].slice.call(obj.getElementsByTagName("trkseg")[0].getElementsByTagName("trkpt")).map(p => {
          return {
            lat: +p.getAttribute('lat'),
            lon: +p.getAttribute('lon'),
            elevation: +p.getElementsByTagName("ele")[0].textContent,
            time: moment(p.getElementsByTagName("time")[0].textContent)
          }
        }));
        return Object.assign({}, routeObject, {name, ride});
      })
    );
  }

  getRideInfo(points: any[]){
    console.log(points);
    let ascent = 0, descent = 0;
    let heightProfile = [];
    let durationSec = 0;
    let distance = this.getTotalDistance(points.map(p => [p.lon, p.lat]));
    let center = this.getCenter(points.map(p => [p.lon, p.lat]));

    let tmpDist = 0;
    points.forEach((p, idx) => {

      tmpDist = tmpDist + (idx > 0 ? this.getDistance([[p.lon, p.lat], [points[idx - 1].lon, points[idx - 1].lat]]) : 0);
      heightProfile.push([tmpDist, p.elevation]);

      if(idx > 0){
        const diff = Math.round(p.elevation - points[idx - 1].elevation);
        if (diff > 0) {
          ascent += diff;
        } else {
          descent += -diff;
        }

        durationSec += p.time.diff(points[idx - 1].time);
      }
    });

    const duration = moment("2010-01-01").startOf('day').milliseconds(durationSec).format('HH:mm');

    return {
      ascent,
      descent,
      heightProfile,
      duration,
      distance,
      center
    }
  }

  getDistance(points){
    return turf.length(turf.lineString(points));
  }
  getTotalDistance(points){
    return Math.round(turf.length(turf.lineString(points)) * 10) / 10;
  }
  getCenter(points){
    const geom = turf.polygon([points]);
    return turf.centroid(geom).geometry.coordinates;
  }


}

