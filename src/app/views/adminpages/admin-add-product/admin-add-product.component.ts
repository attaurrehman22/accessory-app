import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

@Component({
  selector: "app-admin-add-product",
  templateUrl: "./admin-add-product.component.html",
  styleUrls: ["./admin-add-product.component.css"],
})
export class AdminAddProductComponent {
  apiUrl = environment.apiimagespath;
  product:any;
  productMainImage: any;
  thumbnails: string[] = [];
  selectedImage: string;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: AlertsServicesService,
    public dialogRef: MatDialogRef<AdminAddProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.product=data.data;

    if (this.product) {
      this.productMainImage = this.product.main_image;
    
      // Check if additional_images is a valid JSON string and parse it
      try {
        this.thumbnails = JSON.parse(this.product.additional_images);
      } catch (error) {
        console.error("Error parsing additional_images:", error);
        this.thumbnails = []; // Default to an empty array if parsing fails
      }
    
      if (!Array.isArray(this.thumbnails)) {
        this.thumbnails = []; // Ensure it's an array
      }
    
      // Add proof images if they exist
      if (this.product?.proof_image_1) {
        this.thumbnails.push(this.product.proof_image_1);
      }
    
      if (this.product?.proof_image_2) {
        this.thumbnails.push(this.product.proof_image_2);
      }
    
      if (this.thumbnails.length > 0) {
        this.selectedImage = this.thumbnails[0];
      }
    }
    
  }
  ngOnInit(): void {
   
  }
  save(param:string) {
    this.dialogRef.close(param);  
  }
  cancel() {
    this.dialogRef.close()
  }

  swapImages(clickedImage: string): void {
    this.selectedImage = clickedImage;
  }
}
