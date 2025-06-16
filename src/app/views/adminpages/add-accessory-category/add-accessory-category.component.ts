import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-add-accessory-category",
  templateUrl: "./add-accessory-category.component.html",
  styleUrls: ["./add-accessory-category.component.css"],
})
export class AddAccessoryCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  paramVal: any;
  categoryID: any;
  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAccessoryCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log("Data", data);

    this.categoryForm = this.fb.group({
      category_sub_group_id: [
        0,
        [Validators.minLength(1), Validators.maxLength(50)],
      ],
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
      active: [true],
      featured: [true],
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
    });

    if (data?.param == "Edit") {
      this.paramVal = "Edit";
      this.categoryID = data?.data?.id;
      this.categoryForm.patchValue({
        category_sub_group_id: data.data.category_sub_group_id,
        name: data.data.name,
        slug: data.data.slug,
        description: data.data.description,
        active: !!data.data.active, // Convert 1/0 to true/false
        featured: !!data.data.featured,
        order: data.data.order,
        meta_title: data.data.meta_title,
        meta_description: data.data.meta_description,
      });
    } else {
      this.paramVal = "Create";
    }
  }

  ngOnInit(): void {
      this.getAllAccessoryCategoryGroups()
  }

  accessroiesCategoryGroupList:any;

  getAllAccessoryCategoryGroups(){
    this.http.getAdminAccessroiesSubCategoryGroups().subscribe(
      (res)=>{
        this.accessroiesCategoryGroupList = res.data
      }
    )
  }

  onSubmit(): void {
    console.log("this form", this.categoryForm.value);
    if (this.categoryForm.valid) {
      console.log("Form Values:", this.categoryForm.value);
      if (this.paramVal == "Create") {
        this.http.addAdminAccessroyCategory(this.categoryForm.value).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Category add successfully");
            this.dialogRef.close(true);
          },
          (err) => {
            console.log("Error", err.error.message);
            if (err?.error?.message) {
              this.alertService.showAlert("warning", err.error.message);
            } else {
              this.alertService.showAlert(
                "warning",
                "Error in creating Category"
              );
            }
          }
        );
      } else {
        this.http
          .editAdminAccessroyCategory(this.categoryForm.value, this.categoryID)
          .subscribe(
            (res) => {
              this.alertService.showAlert(
                "success",
                "Category update successfully"
              );
              this.dialogRef.close(true);
            },
            (err) => {
              if (err?.error?.message) {
                this.alertService.showAlert("warning", err.error.message);
              } else {
                this.alertService.showAlert(
                  "warning",
                  "Error in updating Category"
                );
              }
            }
          );
      }
    } else {
      this.alertService.showAlert("warning", "Please Add Form Values");
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
