import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CustomerType } from "app/utils/constants";

@Component({
  selector: "app-transfer-sovereignty-old-owner",
  templateUrl: "./transfer-sovereignty-old-owner.component.html",
  styleUrls: ["./transfer-sovereignty-old-owner.component.scss"],
})
export class TransferSovereigntyOldOwnerComponent implements OnInit {
  @Output() showModal = new EventEmitter();
  @Input() data;
  customerType = CustomerType;

  constructor() {}

  ngOnInit(): void {}
  submit() {
    this.showModal.emit(true);
  }
}
