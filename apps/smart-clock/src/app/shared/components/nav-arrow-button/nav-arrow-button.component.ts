import { Component, Input } from "@angular/core";
import { Direction } from "@shared/models/direction.enum";

@Component({
  selector: "app-nav-arrow-button",
  templateUrl: "./nav-arrow-button.component.html",
  styleUrls: ["./nav-arrow-button.component.scss"],
})
export class NavArrowButtonComponent {
  @Input() link: string;
  @Input() direction: Direction;
}
