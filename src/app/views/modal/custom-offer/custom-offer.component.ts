import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { priceValidator } from "../../validator/string.validator";
import { environment } from "src/environments/environment";
import { LoginStateService } from "src/services/login-service/login-state.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-custom-offer",
  templateUrl: "./custom-offer.component.html",
  styleUrls: ["./custom-offer.component.css"],
})
export class CustomOfferComponent {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  apiUrl = environment.apipath + "/";
  offerForm: FormGroup;
  compoName: any;
  productPrice: any;
  isSeller: boolean = false;
  offerID: any;
  offerDetails: any;
  validDays: any;
  isUserBuyer: boolean = false;
  getProductDetails: any;
  fromProductDeatilsLabel: any;
  headerLabel: string = "Custom Offer";
  headerParagraph: string = "Create Custom Offer";
  fromProductDeatilsLabelPlaceholder: string = "Price";

  constructor(
    private fb: FormBuilder,
    private alertService: AlertsServicesService,
    private http: HttpService,
    public translateService: TranslateService,
    private loginStateService: LoginStateService,
    public dialogRef: MatDialogRef<CustomOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
    this.compoName = this.data.param;
    this.isUserBuyer = data?.userCategory;
    if (this.data?.productDetail) {
      this.productPrice = this.data?.productDetail?.price;
    }
    if (this.data?.customOfferDetails?.product) {
      this.offerDetails = data?.customOfferDetails;
      this.validDays = data?.customOfferDetails?.days?.toString();
      this.productPrice = this.data?.customOfferDetails?.product?.price;
    }
    if (this.data?.productDetail?.price) {
      this.productPrice = this.data?.productDetail?.price;
    }

    if (data?.productDetailsfromChat) {
      this.getProductDetails = data?.productDetailsfromChat;
    }

    if (this.compoName == "buyComp") {
      this.getProductDetails = this.data?.productDetail;
    }

    if (this.data?.buyLabel) {
      this.fromProductDeatilsLabel = this.data?.buyLabel;
      this.fromProductDeatilsLabelPlaceholder = "Enter Custom Offer";
    } else {
      this.fromProductDeatilsLabel = "Price";
      this.fromProductDeatilsLabelPlaceholder = "Enter Price";
    }

    if (this.data?.header) {
      this.headerLabel = this.data?.header;
    }

    if (this.data?.headerPara) {
      this.headerParagraph = this.data?.headerPara;
    }

    this.offerForm = this.fb.group({
      offer_price: [
        null,
        [
          Validators.required,
          priceValidator(this.productPrice),
          Validators.min(0),
        ],
      ],
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
          offer_id: Number(productDetail?.id) || 0,
          offer_price: Number(productDetail?.offer_price) || 0,
          ship_price: productDetail?.ship_price || 0,
          chat_id: productDetail?.chat_id?.toString() || 0,
          validity_days: this.validDays || 0,
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
      if (this.data?.param === "buyComp") {
        const productDetail = this.data?.productDetail || {};
        this.productPrice = productDetail?.price;
        if (productDetail) {
          this.offerForm.patchValue({
            product_id: productDetail?.id || 0,
            sender_id: localStorage?.getItem("userID") || 0,
          });
        }
      } else {
        const productDetail1 = this.data?.datawithChat_ID || {};
        if (productDetail1 !== null) {
          this.offerForm.patchValue({
            product_id: productDetail1?.product_ID || 0,
            sender_id: localStorage?.getItem("userID") || 0,
            chat_id: productDetail1?.chat_ID || null,
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
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Offer Update Succesfully"
              );
            } else {
              this.alertService.showAlert("success", "تم تحديث العرض بنجاح");
            }
            this.dialogRef.close(this.offerForm.value);
          },
          (err) => {
            if (err && err.error && err.error.error) {
              this.alertService.showAlert("warning", err.error.error);
            } else {
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in Updating offer"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء تحديث العرض"
                );
              }
            }
          }
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Form is invalid!");
        } else {
          this.alertService.showAlert("warning", "النموذج غير صالح!");
        }
      }
    } else {
      if (this.offerForm.valid) {
        this.http.sendOffer(this.offerForm.value).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Custom offer create Succesfully"
              );
            } else {
              this.alertService.showAlert(
                "success",
                "تم إنشاء العرض المخصص بنجاح"
              );
            }
            this.dialogRef.close(this.offerForm.value);
          },
          (err) => {
            if (err && err.error && err.error.error) {
              this.alertService.showAlert("warning", err.error.error);
            } else {
              const errorMessage =
                err.error?.message || "Something went wrong!";
              this.alertService.showAlert("warning", errorMessage);
            }
          }
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Form is invalid!");
        } else {
          this.alertService.showAlert("warning", "النموذج غير صالح!");
        }
      }
    }
  }

  markAsSold() {
    const formData = {
      offer_id: this.offerID,
      product_id: this.offerDetails.product.id,
      action_type: "mark_sold",
      chat_id: this.offerDetails.chat_id,
      receiver_id: this.offerDetails.sender_id,
      sender_id: localStorage.getItem("userID"),
    };
    this.http.sendMessage(formData).subscribe(
      (res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "success",
            "Product Mark as Sold Succesfully"
          );
        } else {
          this.alertService.showAlert(
            "success",
            `تم وضع علامة "تم البيع" على المنتج بنجاح`
          );
        }
        // this.dialogRef.close(this.offerForm.value);
      },
      (err) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "danger",
            "Error in Product Mark as Sold"
          );
        } else {
          this.alertService.showAlert(
            "danger",
            `حدث خطأ في وضع علامة "تم البيع" على المنتج`
          );
        }
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
