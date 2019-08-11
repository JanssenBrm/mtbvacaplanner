import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.css']
})
export class MobileHeaderComponent implements OnInit {

  constructor() { }

  @Output()
  toggle: EventEmitter<string> = new EventEmitter();

  ngOnInit() {
  }

  toggleMenu(){
    this.toggle.emit('menu');
  }

}
