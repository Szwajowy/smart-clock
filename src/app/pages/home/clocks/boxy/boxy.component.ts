import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-boxy-clock",
  templateUrl: "./boxy.component.html",
  styleUrls: ["./boxy.component.scss"],
})
export class BoxyComponent implements OnInit {
  @Input() time;
  @Input() timezone;

  constructor() {}

  ngOnInit() {}
}
