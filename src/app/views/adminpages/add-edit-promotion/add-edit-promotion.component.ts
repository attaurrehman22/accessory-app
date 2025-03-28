import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import * as moment from "moment";

@Component({
  selector: "app-add-edit-promotion",
  templateUrl: "./add-edit-promotion.component.html",
  styleUrls: ["./add-edit-promotion.component.css"],
})
export class AddEditPromotionComponent implements OnInit {
  promotionForm: FormGroup;
  labelMessage: any;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
promotionID:any;
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private alertService: AlertsServicesService,
    public dialogRef: MatDialogRef<AddEditPromotionComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log("Data", data);

    // Initialize form in the constructor
    this.promotionForm = this.fb.group({
      product_id: new FormControl(null, Validators.required),
      promotion_type: new FormControl("", Validators.required),
      discount: new FormControl("", Validators.required),
      start_date: new FormControl("", Validators.required),
      end_date: new FormControl("", Validators.required),
      promotion_banner: new FormControl(null, Validators.required),
      is_active: new FormControl(false, Validators.required),
    });

    // Populate form based on data
    if (data?.data?.id) {
      this.promotionForm.get("product_id")?.setValue(data.data.id);
    }

    if (data?.param === "Create") {
      this.labelMessage = "Add New Promotion";
    } else {
      this.labelMessage = "Edit Promotion";
      this.promotionForm.patchValue({
        promotion_type: data?.data?.promotion_type,
        discount: data?.data?.discount,
        start_date: data?.data?.start_date
          ? moment(data?.data?.start_date).format("YYYY-MM-DD")
          : null,
        end_date: data?.data?.end_date
          ? moment(data?.data?.end_date).format("YYYY-MM-DD")
          : null,
        is_active: data?.data?.promotio_is_active,
      });

      this.promotionID=data?.data?.promotion_id

      if (data?.data?.promotion_banner) {
        this.previewImage =
          "https://api.chronosouq.com/" + data.data.promotion_banner;
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // ✅ Allow only specific image extensions
      const allowedExtensions = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];
      if (!allowedExtensions.includes(file.type)) {
        alert("Only JPG, PNG , jpg , and GIF files are allowed.");
        return;
      }else{
        this.selectedFile = file;
        this.promotionForm.get("promotion_banner")?.setValue(file);
  
        // ✅ Preview image
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
        };
        reader.readAsDataURL(file);
      }

      
    }
  }

  ngOnInit(): void {}

  async onSave() {
    const formData = new FormData();
    formData.append("product_id", this.promotionForm.value.product_id);
    formData.append("promotion_type", this.promotionForm.value.promotion_type);
    formData.append("discount", this.promotionForm.value.discount);
    formData.append(
      "start_date",
      moment(this.promotionForm.value.start_date).format("YYYY-MM-DD")
    );
    formData.append(
      "end_date",
      moment(this.promotionForm.value.end_date).format("YYYY-MM-DD")
    );
    formData.append("is_active", this.promotionForm.value.is_active);
    if (this.labelMessage == "Add New Promotion") {
      if (this.selectedFile) {
        formData.append("promotion_banner", this.selectedFile);
      }
    } else {
      if (this.selectedFile) {
        formData.append("promotion_banner", this.selectedFile);
      }
    }
    if (this.promotionForm.valid && this.labelMessage == "Add New Promotion") {
      console.log("FormData:", formData);

      this.http.AddPromotionProducts(formData).subscribe(
        (res) => {
          this.alertService.showAlert("success", "Add product into promotion");
          this.dialogRef.close(true);
        },
        (err) => {
          this.alertService.showAlert(
            "warning",
            "Error in product adding into Promotion"
          );
        }
      );
    } else if (this.labelMessage == "Edit Promotion") {
      let isFormValid;
      if(!this.selectedFile){
        let { promotion_banner, ...formValues } = this.promotionForm.value;
        // Check if all other fields except 'promotion_banner' are valid
        isFormValid = Object.keys(formValues).every(
          key => this.promotionForm.get(key)?.valid
        );
      }else{
        if(this.promotionForm.valid){
          isFormValid=true
        }else{
          isFormValid=false
        }
      }

      if (isFormValid) {
        this.http
          .EditPromotionProducts(formData, this.promotionID)
          .subscribe(
            (res) => {
              this.alertService.showAlert(
                "success",
                "Edit product into promotion"
              );
              this.dialogRef.close(true);
            },
            (err) => {
              this.alertService.showAlert(
                "warning",
                "Error in product updating into Promotion"
              );
            }
          );
        }else{
          this.alertService.showAlert(
            "warning",
            "Please fill all required fields correctly"
          );
        }
    } else {
      this.alertService.showAlert("warning", "Please add form values");
      console.log("Form is invalid");
    }
  }

  cancel() {
    
    this.dialogRef.close();
  }
}
