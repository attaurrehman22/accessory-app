import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-add-accessory-category-group",
  templateUrl: "./add-accessory-category-group.component.html",
  styleUrls: ["./add-accessory-category-group.component.css"],
})
export class AddAccessoryCategoryGroupComponent implements OnInit {
  categoryForm: FormGroup;
  paramVal: any;
  categoryID: any;
  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAccessoryCategoryGroupComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log("Data", data);

    this.categoryForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      slug: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
        ],
      ],
      // active: [true],
      order: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
      meta_title: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
        ],
      ],
      meta_description: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(160),
        ],
      ],
      icon: ["", [Validators.required]],
    });

    if (data?.param == "Edit") {
      this.paramVal = "Edit";
      this.categoryID = data?.data?.id;
      this.categoryForm.patchValue({
        name: data.data.name,
        icon: data.data.icon,
        slug: data.data.slug,
        description: data.data.description,
        // active: !!data.data.active, // Convert 1/0 to true/false
        order: data.data.order,
        meta_title: data.data.meta_title,
        meta_description: data.data.meta_description,
      });
    } else {
      this.paramVal = "Create";
    }
  }

  ngOnInit(): void {
    this.getAllAccessoryCategoryGroups();
  }

  accessroiesCategoryGroupList: any;

  getAllAccessoryCategoryGroups() {
    this.http.getAdminAccessroiesCategoryGroups().subscribe((res) => {
      this.accessroiesCategoryGroupList = res.data;
    });
  }

  onSubmit(): void {
  console.log("this form", this.categoryForm.value);

  if (this.categoryForm.valid) {
    const formValue = this.categoryForm.value;
    const formData = new FormData();

    // Append each field with proper type conversion
    Object.keys(formValue).forEach((key) => {
      // if (key === 'active') {
      //   formData.append(key, formValue[key] ? 'true' : 'false'); // Explicit boolean string
      // } else {
        formData.append(key, formValue[key]);
      // }
    });

    if (this.paramVal === "Create") {
      this.http.addAdminAccessroiesCategoryGroups(formData).subscribe(
        (res) => {
          this.alertService.showAlert("success", "Category added successfully");
          this.dialogRef.close(true);
        },
        (err) => {
          console.log("Error", err.error.message);
          if (err?.error?.message) {
            this.alertService.showAlert("warning", err.error.message);
          } else {
            this.alertService.showAlert("warning", "Error in creating Category");
          }
        }
      );
    } else {
      this.http.editAdminAccessroiesCategoryGroups(formData, this.categoryID).subscribe(
        (res) => {
          this.alertService.showAlert("success", "Category updated successfully");
          this.dialogRef.close(true);
        },
        (err) => {
          if (err?.error?.message) {
            this.alertService.showAlert("warning", err.error.message);
          } else {
            this.alertService.showAlert("warning", "Error in updating Category");
          }
        }
      );
    }
  } else {
    this.alertService.showAlert("warning", "Please fill all form fields and upload an image");
  }
}


  onCancel(): void {
    this.dialogRef.close(false);
  }
}
