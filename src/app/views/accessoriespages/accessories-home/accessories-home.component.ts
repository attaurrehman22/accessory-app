import { animate, style, transition, trigger } from "@angular/animations";
import { Component } from "@angular/core";

@Component({
  selector: "app-accessories-home",
  templateUrl: "./accessories-home.component.html",
  styleUrls: ["./accessories-home.component.css"],
  animations: [
    trigger("heroEnter", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate(
          "0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          style({ opacity: 1, transform: "none" }),
        ),
      ]),
    ]),
    trigger("belowEnter", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(24px)" }),
        animate(
          "0.62s 0.1s cubic-bezier(0.22, 1, 0.36, 1)",
          style({ opacity: 1, transform: "none" }),
        ),
      ]),
    ]),
  ],
})
export class AccessoriesHomeComponent {}
