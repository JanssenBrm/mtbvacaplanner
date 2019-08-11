import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit {

  @Input()
  layers: any[];

  @Input()
  activeRoute: any;

  constructor() { }

  ngOnInit() {
  }

  getBackgroundLayers(layers: any){
    return this.layers.filter(l => l.get('name') && l.get('name').indexOf('background_') >= 0);
  }

  getRouteLayers(layers: any){
    return this.layers.filter(l => l.get('name') && l.get('name') === `route_${this.activeRoute.id}`);
  }

  getInfoLayers(layers: any){
    return this.layers.filter(l =>  l.get('name') && l.get('name').indexOf('info') >= 0);
  }
  toggleLayer(layer: any){
    layer.setVisible(!layer.getVisible());
  }

  toggleBackgroundLayer(name: any){
    const backgroundLayers = this.getBackgroundLayers(this.layers);

    backgroundLayers.forEach(l => {
      l.setVisible(l.get('name') === name);
    });
  }
}
