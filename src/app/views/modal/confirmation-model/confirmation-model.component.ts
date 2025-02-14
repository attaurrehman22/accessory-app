import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirmation-model",
  templateUrl: "./confirmation-model.component.html",
  styleUrls: ["./confirmation-model.component.css"],
})
export class ConfirmationModelComponent {
  message: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message;
  }

  confirm() {
    this.dialogRef.close(true);
  }

  // Method to cancel the action
  cancel() {
    this.dialogRef.close(false);
  }
}
