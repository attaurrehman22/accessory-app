import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-add-attribute-values',
  templateUrl: './add-attribute-values.component.html',
  styleUrls: ['./add-attribute-values.component.css']
})
export class AddAttributeValuesComponent implements OnInit {
  categoryForm: FormGroup;
  paramVal: any;
  categoryID: any;
  accessoryCategoryList:any;
  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAttributeValuesComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log("Data", data);

    this.categoryForm = this.fb.group({
      attribute_id: [
        0,
        [Validators.minLength(0), Validators.maxLength(1000)],
      ],
      //  shop_id: [
      //   0,
      //   [Validators.minLength(0), Validators.maxLength(1000)],
      // ],
      value: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      color: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      order: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1000)]
      ]
    });

    if (data?.param == "Edit") {
      this.paramVal = "Edit";
      this.categoryID = data?.data?.id;
      this.categoryForm.patchValue({
        attribute_id: data.data.attribute_id,
        // shop_id: data.data.shop_id,
        value: data.data.value,
        color: data.data.color,
        order: data.data.order,
      });
    } else {
      this.paramVal = "Create";
    }
  }

  ngOnInit(): void {
    this.getAllAttributes()
      // this.getAllAccessoryCategoryGroups()
  }

  getAllAttributes(){
    this.http.getAttributesType().subscribe((res) => {
        this.accessoryCategoryList = res;
      });
  }

  // accessroiesCategoryGroupList:any;

  // getAllAccessoryCategoryGroups(){
  //   this.http.getAdminAccessroiesCategoryGroups().subscribe(
  //     (res)=>{
  //       this.accessroiesCategoryGroupList = res.data
  //     }
  //   )
  // }

  onSubmit(): void {
    console.log("this form", this.categoryForm.value);
    if (this.categoryForm.valid) {
      console.log("Form Values:", this.categoryForm.value);
      if (this.paramVal == "Create") {
        this.http.addAttributesValue(this.categoryForm.value).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Attribute Value add successfully");
            this.dialogRef.close(true);
          },
          (err) => {
            console.log("Error", err.error.message);
            if (err?.error?.message) {
              this.alertService.showAlert("warning", err.error.message);
            } else {
              this.alertService.showAlert(
                "warning",
                "Error in creating Attribute Value"
              );
            }
          }
        );
      } else {
        this.http
          .editAttributesValue(this.categoryForm.value, this.categoryID)
          .subscribe(
            (res) => {
              this.alertService.showAlert(
                "success",
                "Attribute Value update successfully"
              );
              this.dialogRef.close(true);
            },
            (err) => {
              if (err?.error?.message) {
                this.alertService.showAlert("warning", err.error.message);
              } else {
                this.alertService.showAlert(
                  "warning",
                  "Error in updating Attribute Value"
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
