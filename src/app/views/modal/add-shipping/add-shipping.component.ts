import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

@Component({
  selector: "app-add-shipping",
  templateUrl: "./add-shipping.component.html",
  styleUrls: ["./add-shipping.component.css"],
})
export class AddShippingComponent {
  offerForm: FormGroup;
  isMarkAsSold:boolean=false;
  isAlreadyMarkedSold:boolean=false;


  constructor(private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddShippingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offerForm = this.fb.group({
      ship_price: [null, [Validators.required, Validators.min(0)]],
      validity_days:[null, [Validators.required]],
    });

    this.isAlreadyMarkedSold=data?.isShowMarkAsSold;
  }

  markAsSold(){
    if(this.isMarkAsSold == true){
      this.isMarkAsSold=false;
      this.alertService.showAlert('success','Mark as sold will remove the product from the listing');
    }else{
    this.isMarkAsSold=true;
    this.alertService.showAlert('success','Product Mark as sold will from the listing');
  }
    
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
