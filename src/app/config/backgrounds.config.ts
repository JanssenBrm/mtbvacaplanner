import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import XYZ from 'ol/source/XYZ.js'

export const BACKGROUNDS = [
  {
    name: 'background_googlemaps',
    title: 'Satellite',
    layer: new TileLayer({
      source: new XYZ({
        url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
      })
    })
  },
  {
    name: 'background_opencyclemap',
    title: 'Open Cycle Map',
    layer: new TileLayer({
      source: new XYZ({
        url: 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=e0e4913949b54732a95adede99ee8a24'
      })
    })
  },
  {
    name: 'background_Outdoors',
    title: 'Outdoors',
    layer: new TileLayer({
      source: new XYZ({
        url: 'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=e0e4913949b54732a95adede99ee8a24'
      })
    })
  },

  ];
