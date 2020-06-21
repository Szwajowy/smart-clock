import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-standart-clock',
  templateUrl: './standart.component.html',
  styleUrls: ['./standart.component.scss']
})
export class StandartComponent implements OnInit, OnChanges {

  @Input() time;
  @Input() timezone$;
  @Input() username: string;

  public helloMsg: string = "Witaj";

  constructor() { }

  ngOnInit() {
    this.setHelloMsg();
  }

  ngOnChanges() {
    this.setHelloMsg();
  }

  setHelloMsg() {
    if (!this.time) return;

    if (this.time.getHours() < 18 && this.time.getHours() >= 5) {
      this.helloMsg = "Dzień dobry";
    } else if (this.time.getHours() < 21 && this.time.getHours() >= 18) {
      this.helloMsg = "Dobry wieczór";
    } else {
      this.helloMsg = "Dobranoc";
    }
  }

}
