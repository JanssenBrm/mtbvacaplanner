import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit {

  @Input()
  layers: any[];

  constructor() { }

  ngOnInit() {
    console.log(this.layers);
  }

  getBackgroundLayers(layers: any){
    return this.layers.filter(l => l.get('name') && l.get('name').indexOf('background_') >= 0);
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
