import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-add-attribute-listing',
  templateUrl: './add-attribute-listing.component.html',
  styleUrls: ['./add-attribute-listing.component.css']
})
export class AddAttributeListingComponent implements OnInit {
  attributeForm: FormGroup;
  paramVal: any;
  categoryID: any;
  attributeTypeList: any;

  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAttributeListingComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.attributeForm = this.fb.group({
      attribute_type_id: [
        0,
        [Validators.minLength(0), Validators.maxLength(1000)],
      ],
      name: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      ],
      order: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
      values: this.fb.array([]) // Initialize FormArray
    });

    if (data?.param == "Edit") {
      this.paramVal = "Edit";
      this.categoryID = data?.data?.id;
      this.attributeForm.patchValue({
        attribute_type_id: data.data.attribute_type_id,
        name: data.data.name,
        order: data.data.order,
      });

      data.data.values.forEach((val: any) => {
        this.addValue(val);
      });
    } else {
      this.paramVal = "Create";
      this.addValue(); // Add one value by default in create mode
    }
  }

  ngOnInit(): void {
    this.getAllAttributesTypes();
  }

  getAllAttributesTypes() {
    this.http.getAttributesType().subscribe((res) => {
      this.attributeTypeList = res;
    });
  }

  get values(): FormArray {
    return this.attributeForm.get('values') as FormArray;
  }

  addValue(value: any = { value: '', color: '', order: 0 }) {
    this.values.push(
      this.fb.group({
        value: [value.value, [Validators.required]],
        color: [value.color],
        order: [value.order, [Validators.min(0), Validators.max(1000)]]
      })
    );
  }

  removeValue(index: number) {
    this.values.removeAt(index);
  }

  onSubmit() {
    if (this.attributeForm.valid) {
      const payload = this.attributeForm.value;
      if(this.paramVal == 'Create'){
        this.http.addAttributes(payload).subscribe(
          (res)=>{
            this.alertService.showAlert("success", "Attribute add successfully");
            this.dialogRef.close(true);
          },(err)=>{
            if (err?.error?.message) {
              this.alertService.showAlert("warning", err.error.message);
            } else {
              this.alertService.showAlert(
                "warning",
                "Error in creating Attribute"
              );
            }
          }
        )
      }else{
        this.http.editAttributes(payload,this.categoryID).subscribe(
          (res)=>{
            this.alertService.showAlert(
                "success",
                "Attribute update successfully"
              );
            this.dialogRef.close(true);
          },(err)=>{
             if (err?.error?.message) {
                this.alertService.showAlert("warning", err.error.message);
              } else {
                this.alertService.showAlert(
                  "warning",
                  "Error in updating Attribute"
                );
              }
          }
        )
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

