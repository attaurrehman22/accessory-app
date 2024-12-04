import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-shipping",
  templateUrl: "./add-shipping.component.html",
  styleUrls: ["./add-shipping.component.css"],
})
export class AddShippingComponent {
  offerForm: FormGroup;
  isMarkAsSold:boolean=false;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddShippingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offerForm = this.fb.group({
      ship_price: [null, [Validators.required, Validators.min(0)]],
      validity_days:[null, [Validators.required]],
    });
  }

  markAsSold(){
    this.isMarkAsSold=true
  }

  onCancel(){
    this.dialogRef.close();
  }

  onSendOffer(): void {
    const modalData={
      formData:this.offerForm.value,
      soldMark:this.isMarkAsSold
    }
    this.dialogRef.close(modalData);
  }
}
