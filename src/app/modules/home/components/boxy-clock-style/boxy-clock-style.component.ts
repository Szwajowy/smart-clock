import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-boxy-clock",
  templateUrl: "./boxy-clock-style.component.html",
  styleUrls: ["./boxy-clock-style.component.scss"],
})
export class BoxyClockStyleComponent implements OnInit {
  @Input() time;
  @Input() timezone;

  constructor() {}

  ngOnInit() {}
}
