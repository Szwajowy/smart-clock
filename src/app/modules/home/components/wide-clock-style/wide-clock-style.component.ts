import { Component, Input } from "@angular/core";

@Component({
  selector: "app-wide-clock",
  templateUrl: "./wide-clock-style.component.html",
  styleUrls: ["./wide-clock-style.component.scss"],
})
export class WideStyleClockComponent {
  @Input() time;
  @Input() timezone;
}
