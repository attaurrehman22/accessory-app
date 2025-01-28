import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { priceValidator } from "../../validator/string.validator";

@Component({
  selector: "app-custom-offer",
  templateUrl: "./custom-offer.component.html",
  styleUrls: ["./custom-offer.component.css"],
})
export class CustomOfferComponent {
  offerForm: FormGroup;
  compoName: any;
  productPrice:any;
  isSeller: boolean = false;
  offerID: any;
  offerDetails:any;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertsServicesService,
    private http: HttpService,
    public dialogRef: MatDialogRef<CustomOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.compoName = this.data.param;
    if(this.data?.productDetail){
      this.productPrice=this.data.productDetail.price
    }
    if(this.data?.customOfferDetails?.product){
      this.offerDetails=data?.customOfferDetails
      this.productPrice=this.data?.customOfferDetails?.product.price
    }
    if(this.data?.productDetail?.price){
      this.productPrice=this.data.productDetail.price
    }


    
    this.offerForm = this.fb.group({
      offer_price: [null, [Validators.required, 
        priceValidator(this.productPrice) 
        ,Validators.min(0)]],
      product_id: [0],
      sender_id: [0],
      chat_id: [null],
    });

    if (this.compoName === "editComp") {
      this.offerForm.addControl(
        "ship_price",
        this.fb.control(null, Validators.required)
      );
      this.offerForm.addControl(
        "offer_id",
        this.fb.control(null, Validators.required)
      );
      this.offerForm.addControl(
        "validity_days",
        this.fb.control(null, Validators.required)
      );
      const productDetail = this.data?.customOfferDetails;
      if (productDetail !== null) {
        this.offerForm.patchValue({
          product_id: productDetail.product_id || 0,
          sender_id: localStorage.getItem("userID").toString() || 0,
          offer_id: Number(productDetail.id) || 0,
          offer_price: Number(productDetail.offer_price) || 0,
          ship_price: productDetail.ship_price || 0,
          chat_id: productDetail.chat_id.toString() || 0,
          // validity_days: productDetail.offer_price || 0,
        });
      }
      if (productDetail !== null) {
        this.offerID = productDetail.id;
        let val = localStorage.getItem("userID");
        if (productDetail.sender.id != val) {
          this.isSeller = true;
        } else {
          this.isSeller = false;
        }
      }
    } else {
      if (this.data.param === "buyComp") {
        const productDetail = this.data?.productDetail || {};
        this.productPrice=productDetail.price
        if (productDetail) {
          this.offerForm.patchValue({
            product_id: productDetail.id || 0,
            sender_id: localStorage.getItem("userID") || 0,
          });
        }
      } else {
        const productDetail1 = this.data?.datawithChat_ID || {};
        if (productDetail1 !== null) {
          this.offerForm.patchValue({
            product_id: productDetail1.product_ID || 0,
            sender_id: localStorage.getItem("userID") || 0,
            chat_id: productDetail1.chat_ID || null,
          });
        }
      }
    }
  }

  onSendOffer(): void {
    if (this.compoName === "editComp") {
      if (this.offerForm.valid) {
        this.http.editOffer(this.offerForm.value).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Offer Update Succesfully");
            this.dialogRef.close(this.offerForm.value);
          },
          (err) => {
            this.alertService.showAlert("danger", "Error in Updating offer");
          }
        );
      } else {
        this.alertService.showAlert("warning", "Form is invalid!");
      }
    } else {
      if (this.offerForm.valid) {
        this.http.sendOffer(this.offerForm.value).subscribe(
          (res) => {
            this.alertService.showAlert(
              "success",
              "Custom offer create Succesfully"
            );
            this.dialogRef.close(this.offerForm.value);
          },
          (err) => {
            const errorMessage = err.error?.message || "Something went wrong!";
            this.alertService.showAlert(
              "danger",
              errorMessage
            );
          }
        );
      } else {
        this.alertService.showAlert("warning", "Form is invalid!");
      }
    }
  }

  markAsSold() {
    const formData = {
      offer_id: this.offerID,
      product_id:this.offerDetails.product.id,
      action_type: "mark_sold",
      chat_id:this.offerDetails.chat_id,
      receiver_id:this.offerDetails.sender_id,
      sender_id:localStorage.getItem("userID")
    };
    this.http.sendMessage(formData).subscribe(
      (res) => {
        this.alertService.showAlert(
          "success",
          "Product Mark as Sold Succesfully"
        );
        // this.dialogRef.close(this.offerForm.value);
      },
      (err) => {
        this.alertService.showAlert("danger", "Error in Product Mark as Sold");
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
