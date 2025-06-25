import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-attribute-inventory',
  templateUrl: './add-attribute-inventory.component.html',
  styleUrls: ['./add-attribute-inventory.component.css']
})
export class AddAttributeInventoryComponent implements OnInit {
  attributeInventoryForm: FormGroup;
  accessoryCategoryList: any;
  attributesList: any;
  InventoriesList: any;
  isEditMode: boolean = false;
  editId: number;

  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public dialogRef: MatDialogRef<AddAttributeInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.initForm();
    if(data.param == "Edit"){
      this.isEditMode = true;
      this.editId = data.data.inventory_id;
      console.log("data", data.data);
      this.attributeInventoryForm.patchValue({
        attribute_id: data.data.attribute_id,
        inventory_id: data.data.inventory_id,
        attribute_value_id: data.data.attribute_value_id
      });
      // this.loadAttributeInventoryData(this.editId);
    }
  }

  ngOnInit(): void {
    this.getAllAttributes();
    this.getAllAccessoryCategories();
    this.getAllInventories();
    
    // Check if we're in edit mode
    // this.route.params.subscribe(params => {
    //   if (params['id']) {
    //     this.isEditMode = true;
    //     this.editId = params['id'];
    //     this.loadAttributeInventoryData(this.editId);
    //   }
    // });
  }

  initForm() {
    this.attributeInventoryForm = this.fb.group({
      attribute_id: ['', Validators.required],
      inventory_id: ['', Validators.required],
      attribute_value_id: ['', Validators.required]
    });
  }

  getAllAttributes() {
    this.http.getAttributes().subscribe(
      (res) => {
        this.attributesList = res;
      },
      (error) => {
        this.alertService.showAlert('danger', 'Error loading attributes');
      }
    );
  }

  getAllAccessoryCategories() {
    this.http.getAttributesValue().subscribe(
      (res) => {
        this.accessoryCategoryList = res;
      },
      (error) => {
        this.alertService.showAlert('danger', 'Error loading accessory categories');
      }
    );
  }

  getAllInventories() {
    this.http.getInventory().subscribe(
      (res) => {
        this.InventoriesList = res.data;
      },
      (error) => {
        this.alertService.showAlert('danger', 'Error loading inventories');
      }
    );
  }

  loadAttributeInventoryData(id: number) {
    this.http.getAdminAttributesInventory().subscribe(
      (res) => {
        const inventory = res.find(item => item.id === id);
        if (inventory) {
          this.attributeInventoryForm.patchValue({
            attribute_id: inventory.attribute_id,
            inventory_id: inventory.inventory_id,
            attribute_value_id: inventory.attribute_value_id
          });
        }
      },
      (error) => {
        this.alertService.showAlert('danger', 'Error loading attribute inventory data');
      }
    );
  }

  onSubmit() {
    if (this.attributeInventoryForm.valid) {
      const formData = this.attributeInventoryForm.value;
      
      if (this.isEditMode) {
        this.http.editAdminAttributesInventory(formData, this.editId).subscribe(
          (res) => {
            this.alertService.showAlert('success', 'Attribute inventory updated successfully');
            this.dialogRef.close(true);
            // this.router.navigate(['/admin/attribute-inventory']);
          },
          (error) => {
            this.alertService.showAlert('danger', 'Error updating attribute inventory');
          }
        );
      } else {
        this.http.addAdminAttributesInventory(formData).subscribe(
          (res) => {
            this.alertService.showAlert('success', 'Attribute inventory added successfully');
            this.attributeInventoryForm.reset();
            this.dialogRef.close(true);
            // this.router.navigate(['/admin/attribute-inventory']);
          },
          (error) => {
            this.alertService.showAlert('danger', 'Error adding attribute inventory');
          }
        );
      }
    } else {
      this.markFormGroupTouched(this.attributeInventoryForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  cancelForm() {
    this.dialogRef.close(false);
  }

  // Helper methods for form validation
  get attribute_id() { return this.attributeInventoryForm.get('attribute_id'); }
  get inventory_id() { return this.attributeInventoryForm.get('inventory_id'); }
  get attribute_value_id() { return this.attributeInventoryForm.get('attribute_value_id'); }
}
