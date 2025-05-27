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
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.css']
})
export class AddAttributeComponent implements OnInit{
  categoryForm: FormGroup;
  paramVal: any;
  categoryID: any;
  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAttributeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log("Data", data);

    this.categoryForm = this.fb.group({
      type: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]
      ]
    });

    if (data?.param == "Edit") {
      this.paramVal = "Edit";
      this.categoryID = data?.data?.id;
      this.categoryForm.patchValue({
        type: data.data.type
      });
    } else {
      this.paramVal = "Create";
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("this form", this.categoryForm.value);
    if (this.categoryForm.valid) {
      console.log("Form Values:", this.categoryForm.value);
      if (this.paramVal == "Create") {
        this.http.addAttributesType(this.categoryForm.value).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Attribute add successfully");
            this.dialogRef.close(true);
          },
          (err) => {
            console.log("Error", err.error.message);
            if (err?.error?.message) {
              this.alertService.showAlert("warning", err.error.message);
            } else {
              this.alertService.showAlert(
                "warning",
                "Error in creating Attribute"
              );
            }
          }
        );
      } else {
        this.http
          .editAttributesType(this.categoryForm.value, this.categoryID)
          .subscribe(
            (res) => {
              this.alertService.showAlert(
                "success",
                "Attribute update successfully"
              );
              this.dialogRef.close(true);
            },
            (err) => {
              if (err?.error?.message) {
                this.alertService.showAlert("warning", err.error.message);
              } else {
                this.alertService.showAlert(
                  "warning",
                  "Error in updating Attribute"
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
