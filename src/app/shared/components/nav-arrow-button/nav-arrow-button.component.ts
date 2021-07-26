import { Component, Input, OnInit } from "@angular/core";
import { Direction } from "@shared/types/direction.enum";

@Component({
  selector: "app-nav-arrow-button",
  templateUrl: "./nav-arrow-button.component.html",
  styleUrls: ["./nav-arrow-button.component.scss"],
})
export class NavArrowButtonComponent implements OnInit {
  @Input() link: string;
  @Input() direction: Direction;

  constructor() {}

  ngOnInit() {}
}
