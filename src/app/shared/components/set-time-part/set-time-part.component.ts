import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-set-time-part",
  templateUrl: "./set-time-part.component.html",
  styleUrls: ["./set-time-part.component.scss"],
})
export class SetTimePartComponent {
  @Input() value: number;
  @Input() upLimit = 99;
  @Input() downLimit = 0;
  @Input() editable = true;
  @Output() changeValue: EventEmitter<number> = new EventEmitter();

  onIncrease() {
    this.value = this.increase(this.value);
    this.changeValue.emit(this.value);
  }

  onDecrease() {
    this.value = this.decrease(this.value);
    this.changeValue.emit(this.value);
  }

  private increase(value: number): number {
    if (value < this.upLimit) return ++value;
    return this.downLimit;
  }

  private decrease(value: number): number {
    if (value > this.downLimit) return --value;
    return this.upLimit;
  }
}
