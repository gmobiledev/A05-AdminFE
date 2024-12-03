import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-view-check-info-new",
  templateUrl: "./view-check-info-new.component.html",
  styleUrls: ["./view-check-info-new.component.scss"],
})
export class ViewCheckInfoNewComponent implements OnInit {
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() select;

  constructor() {}

  ngOnInit(): void {
    
  }

  submit() {
    this.closePopup.next();
  }
}
