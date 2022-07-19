import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

type TimePart = 'hours' | 'minutes' | 'seconds';

@Component({
  selector: "app-set-time-part",
  templateUrl: "./set-time-part.component.html",
  styleUrls: ["./set-time-part.component.scss"],
})
export class SetTimePartComponent implements OnInit {
  @Input() value: number;
  @Input() upLimit = 99;
  @Input() downLimit = 0;
  @Input() editable = true;
  @Output() change: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onIncrease() {
    this.value = this.increase(this.value);
    this.change.emit(this.value);
  }

  onDecrease() {
    this.value = this.decrease(this.value);
    this.change.emit(this.value);
  }

  private increase(value: number): number {
    if(value < this.upLimit)
      return ++value;
    return this.downLimit;
  }

  private decrease(value: number): number {
    if(value > this.downLimit)
      return --value;
    return this.upLimit;
  }
}
