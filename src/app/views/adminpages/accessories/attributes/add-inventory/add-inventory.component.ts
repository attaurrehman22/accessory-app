import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-add-inventory",
  templateUrl: "./add-inventory.component.html",
  styleUrls: ["./add-inventory.component.css"],
})
export class AddInventoryComponent implements OnInit{
  inventoryForm: FormGroup;
  paramVal: any;
  inventoryID: any;
  accessoriesList:any;
  ngOnInit(): void {
      this.getAllAccessory()
  }
  getAllAccessory(){
    this.http.getAccessory().subscribe(
      (res)=>{
          this.accessoriesList = res
      }
    )
  }

  constructor(private http:HttpService,private alertService:AlertsServicesService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.inventoryForm = this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      accessory_id: [0, [Validators.required, Validators.min(0)]],
      brand: ["", [Validators.required]],
      sku: ["", [Validators.required]],
      condition: ["New", [Validators.required]],
      condition_note: [""],
      description: ["", [Validators.required]],
      key_features: [""],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      damaged_quantity: [0, [Validators.min(0)]],
      user_id: [0, [Validators.required]],
      purchase_price: [0, [Validators.required, Validators.min(0)]],
      sale_price: [0, [Validators.required, Validators.min(0)]],
      offer_price: [0, [Validators.min(0)]],
      offer_start: [null],
      offer_end: [null],
      shipping_weight: [0, [Validators.min(0)]],
      free_shipping: [false],
      available_from: [null],
      min_order_quantity: [0, [Validators.min(0)]],
      slug: [""],
      linked_items: [""],
      meta_title: [""],
      meta_description: [""],
      stuff_pick: [false],
      active: [true],
    });

    if (data?.param == "Edit") {
      this.paramVal = "Edit";
      this.inventoryID = data?.data?.id;
      this.inventoryForm.patchValue({
        title: data.data.title,
        accessory_id: data.data.accessory_id,
        brand: data.data.brand,
        sku: data.data.sku,
        condition: data.data.condition,
        condition_note: data.data.condition_note,
        description: data.data.description,
        key_features: data.data.key_features,
        stock_quantity: data.data.stock_quantity,
        quantity: data.data.quantity,
        damaged_quantity: data.data.damaged_quantity,
        user_id: data.data.user_id,
        purchase_price: data.data.purchase_price,
        sale_price: data.data.sale_price,
        offer_price: data.data.offer_price,
        offer_start: data.data.offer_start ? new Date(data.data.offer_start) : null,
        offer_end: data.data.offer_end ? new Date(data.data.offer_end) : null,
        shipping_weight: data.data.shipping_weight,
        free_shipping: data.data.free_shipping,
        available_from: data.data.available_from ? new Date(data.data.available_from) : null, 
        min_order_quantity: data.data.min_order_quantity,
        slug: data.data.slug,
        linked_items: data.data.linked_items,
        meta_title: data.data.meta_title,
        meta_description: data.data.meta_description,
        stuff_pick: data.data.stuff_pick,
        active: data.data.active
      });

    } else {
      this.paramVal = "Create";
    }
    
  }

  onSubmit(): void {
    console.log("this form", this.inventoryForm.value);
    if (this.inventoryForm.valid) {
      console.log("Form Values:", this.inventoryForm.value);
      if (this.paramVal == "Create") {
        this.http.addInventory(this.inventoryForm.value).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Category add successfully");
            this.dialogRef.close(true);
          },
          (err) => {
    //         "errors": {
    //     "sku": [
    //         "The sku has already been taken."
    //     ],
    //     "slug": [
    //         "The slug has already been taken."
    //     ]
    // }
            console.log("Error", err.error.message);
            if(err?.error?.errors?.sku){
              this.alertService.showAlert("warning", err.error.errors.sku[0]);
            }
            else if(err?.error?.errors?.slug){
              this.alertService.showAlert("warning", err.error.errors.slug[0]);
            }
            else if (err?.error?.message) {
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
          .editInventory(this.inventoryForm.value, this.inventoryID)
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
