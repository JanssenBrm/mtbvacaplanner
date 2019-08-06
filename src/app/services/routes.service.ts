import { Injectable } from '@angular/core';
import {ROUTES} from "../config/routes.config";
import GPX from 'ol/format/GPX.js';
import VectorSource from 'ol/source/Vector.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

@Injectable()
export class RoutesService {

  constructor() { }



  getRoutes(){
    let id = 0;

    const styles =  {
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

    return ROUTES.map(route => {
      id++;
      const layer = new VectorLayer({
        source: new VectorSource({
          url: route.path,
          format: new GPX()
        }),
        style: function(feature) {
          return styles[feature.getGeometry().getType()];
        },
        visible: false
      });

      return {
        id: id,
        layer: layer,
        active: false
      }
    })
  }

}
