import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { LoginStateService } from "src/services/login-service/login-state.service";

@Component({
  selector: "app-add-shipping",
  templateUrl: "./add-shipping.component.html",
  styleUrls: ["./add-shipping.component.css"],
})
export class AddShippingComponent {
  offerForm: FormGroup;
  isMarkAsSold: boolean = false;
  isAlreadyMarkedSold: boolean = false;

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  constructor(
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public translateService: TranslateService,
    private loginStateService: LoginStateService,
    public dialogRef: MatDialogRef<AddShippingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.offerForm = this.fb.group({
      ship_price: [null, [Validators.required, Validators.min(0)]],
      validity_days: [null, [Validators.required]],
    });

    this.isAlreadyMarkedSold = data?.isShowMarkAsSold;

    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  markAsSold() {
    if (this.isMarkAsSold == true) {
      this.isMarkAsSold = false;
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert(
          "success",
          "Mark as sold will remove the product from the listing"
        );
      } else {
        this.alertService.showAlert(
          "success",
          'وضع علامة "تم البيع" سيؤدي إلى إزالة المنتج من القائمة'
        );
      }
    } else {
      this.isMarkAsSold = true;
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert(
          "success",
          "Product Mark as sold will from the listing"
        );
      } else {
        this.alertService.showAlert(
          "success",
          'سيتم إزالة المنتج من القائمة عند وضع علامة "تم البيع" عليه'
        );
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSendOffer(): void {
    const modalData = {
      formData: this.offerForm.value,
      soldMark: this.isMarkAsSold,
    };
    this.dialogRef.close(modalData);
  }
}
