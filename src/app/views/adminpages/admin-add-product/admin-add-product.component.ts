import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

@Component({
  selector: "app-admin-add-product",
  templateUrl: "./admin-add-product.component.html",
  styleUrls: ["./admin-add-product.component.css"],
})
export class AdminAddProductComponent {
  product:any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: AlertsServicesService,
    public dialogRef: MatDialogRef<AdminAddProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log("data.data",data.data)
    this.product=data.data;
    // console.log(" this.data", this.data)
  }
  ngOnInit(): void {

  }
  save(param:string) {
    this.dialogRef.close(param);  
  }
  cancel() {
    this.dialogRef.close()
  }
}
