import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  computed,
} from "@angular/core";
import { HttpService } from "src/services/http/http.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
@Component({
  selector: "app-add-product-watch-of-the-day",
  templateUrl: "./add-product-watch-of-the-day.component.html",
  styleUrls: ["./add-product-watch-of-the-day.component.css"],
})
export class AddProductWatchOfTheDayComponent {
  allData: any;
  watchDayForm: FormGroup;
  product_id: FormControl = new FormControl("", [Validators.required]);
  // selectedLangtype: FormControl = new FormControl("eng", [Validators.required]);
  background_color: FormControl = new FormControl("#000000", [
    Validators.required,
  ]);
  type: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(30),
  ]);
  english_text: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(500),
  ]);
  arabic_text: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(500),
  ]);
 
  coverImage: { file: File; url: string } | null = null;
  with_out_attribute: { file: File; url: string } | null = null;
  detailsofProduct: any;
  param: any;

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private alertService: AlertsServicesService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddProductWatchOfTheDayComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    // console.log("data",data)
    if (data) {
      this.detailsofProduct = data.ProductDetails;
      this.param = data.param;
    }
  }

  ngOnInit(): void {
    this.allProducts();
    this.watchDayForm = this.fb.group({
      product_id: this.product_id,
      background_color: this.background_color,
      type: this.type,
      english_text: this.english_text,
      arabic_text: this.arabic_text,
      // selectedLangtype: this.selectedLangtype,
    });

    // this.changeLang();

    if (this.param == "Edit") {
      this.watchDayForm
        .get("product_id")
        .setValue(this.detailsofProduct.product_id);
      this.watchDayForm
        .get("background_color")
        .setValue(this.detailsofProduct.background_color);
      this.watchDayForm.get("type").setValue(this.detailsofProduct.type);
      if (this.detailsofProduct.english_text) {
        // this.watchDayForm.get("selectedLangtype").setValue("eng");
        // this.changeLang('eng');
        this.watchDayForm
          .get("english_text")
          .setValue(this.detailsofProduct.english_text);
      } else {
        // this.watchDayForm.get("selectedLangtype").setValue("ar");
        // this.changeLang('ar');
        this.watchDayForm
          .get("arabic_text")
          .setValue(this.detailsofProduct.arabic_text);
      }
      this.coverImage = {
        file: null,
        url: "https://api.chronosouq.com/" + this.detailsofProduct.banner_img,
      };
      this.with_out_attribute = {
        file: null,
        url:
          "https://api.chronosouq.com/" +
          this.detailsofProduct.with_out_attribute,
      };
    }
  }

  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild("with_out_attributeInput")
  with_out_attributeInput!: ElementRef<HTMLInputElement>;

  selectCoverImage() {
    this.coverImageInput.nativeElement.click();
  }

  selectwithOutAttributeImage() {
    this.with_out_attributeInput.nativeElement.click();
  }

  onCoverImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.alertService.showAlert(
          "warning",
          "The file is too large. Please select an image under 5MB."
        );
        return;
      }
      const allowedExtensions = ["jpeg", "png", "jpg", "gif"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.alertService.showAlert(
          "warning",
          "Invalid file type. Please select an image with one of the following extensions: jpeg, png, jpg, gif."
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.coverImage = { file, url: reader.result as string };
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage() {
    this.coverImage = null;
  }

  onwithOutAttributeSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.alertService.showAlert(
          "warning",
          "The file is too large. Please select an image under 5MB."
        );
        return;
      }
      const allowedExtensions = ["jpeg", "png", "jpg", "gif"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.alertService.showAlert(
          "warning",
          "Invalid file type. Please select an image with one of the following extensions: jpeg, png, jpg, gif"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.with_out_attribute = { file, url: reader.result as string };
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  }

  removewithOutAttributeImage() {
    this.with_out_attribute = null;
  }

  allProducts() {
    const queryString = {
      page: 1, // Set the page number
      per_page: 100, // Set the number of items per page
    };
    this.http.getAdminProductsofQuery(queryString).subscribe(
      (res) => {
        this.allData = res.data.data;
        this.allData = this.allData.map((product: any) => {
          if (product.main_image) {
            product.main_image = product.main_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }
          return product;
        });
      },
      (err) => {}
    );
  }

  cancelForm() {
    this.dialogRef.close();
  }

  // Save data
  saveData() {
    console.log("watchForm", this.watchDayForm);
    //  this.cdRef.detectChanges();
    if (!this.param) {
      if (
        this.watchDayForm.valid &&
        this.coverImage.file &&
        this.with_out_attribute.file
      ) {
        const formData = new FormData();
        formData.append(
          "product_id",
          this.watchDayForm.get("product_id")?.value
        );
        formData.append(
          "background_color",
          this.watchDayForm.get("background_color")?.value
        );
        formData.append("type", this.watchDayForm.get("type")?.value);

        if (!this.param) {
          formData.append("banner_img", this.coverImage.file);
          formData.append("with_out_attribute", this.with_out_attribute.file);
        }

       
          formData.append(
            "english_text",
            this.watchDayForm.get("english_text")?.value
          );

          console.log("arabic calling");
          formData.append(
            "arabic_text",
            this.watchDayForm.get("arabic_text")?.value
          );
      

        this.http.saveWatchOfTheDay(formData).subscribe(
          (response) => {
            this.alertService.showAlert(
              "success",
              "watch of the day update successfully"
            );
            this.dialogRef.close('closed');
          },
          (error) => {
            if(error && error.error){
                this.alertService.showAlert(
                  "warning",
                `error.error.message`
                );
              }else{
                this.alertService.showAlert('warning','Error in creating watch of the day')
              }
          }
        );
      } else {
        this.alertService.showAlert("warning", "Add Form Values");
        console.log("Form is invalid");
      }
    } else {
      if (
        this.watchDayForm.valid &&
        (this.coverImage.file || this.coverImage.url) &&
        (this.with_out_attribute.file || this.with_out_attribute.url)
      ) {
        const formData = new FormData();
        formData.append(
          "product_id",
          this.watchDayForm.get("product_id")?.value
        );
        formData.append(
          "background_color",
          this.watchDayForm.get("background_color")?.value
        );
        formData.append("type", this.watchDayForm.get("type")?.value);

        if (this.coverImage.file) {
          formData.append("banner_img", this.coverImage.file);
        }
        if (this.with_out_attribute.file) {
          formData.append("with_out_attribute", this.with_out_attribute.file);
        }
       
          formData.append(
            "english_text",
            this.watchDayForm.get("english_text")?.value
          );
 
          formData.append(
            "arabic_text",
            this.watchDayForm.get("arabic_text")?.value
          );
 

        formData.append("id", this.detailsofProduct.id);
        this.http.updateWatchOfTheDay(formData).subscribe(
          (response) => {
            this.alertService.showAlert(
              "success",
              "Add product into watch of the day"
            );
            this.dialogRef.close('closed');
          },
          (error) => {
            if(error && error.error){
              this.alertService.showAlert(
                "warning",
              `error.error.message`
              );
            }else{
              this.alertService.showAlert('warning','Error in updating watch of the day')
            }
          }
        );
      } else {
        this.alertService.showAlert("warning", "Add Form Values");
        console.log("Form is invalid");
      }
    }
  }
}
