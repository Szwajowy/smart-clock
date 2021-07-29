import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

export interface NavigationRoutes {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

@Component({
  selector: "app-page-skeleton",
  templateUrl: "./page-skeleton.component.html",
  styleUrls: ["./page-skeleton.component.scss"],
})
export class PageSkeletonComponent {
  @Input() navigation: NavigationRoutes;

  constructor(protected router: Router) {}

  onSwipeLeft() {
    if (this.navigation.right) this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if (this.navigation.left) this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if (this.navigation.bottom) this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if (this.navigation.top) this.router.navigate([this.navigation.top]);
  }
}
