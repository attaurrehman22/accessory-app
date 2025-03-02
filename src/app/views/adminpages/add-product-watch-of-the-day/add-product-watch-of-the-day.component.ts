import { Component,ElementRef,Inject,
  ViewChild,
  computed, } from '@angular/core';
import { HttpService } from "src/services/http/http.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: 'app-add-product-watch-of-the-day',
  templateUrl: './add-product-watch-of-the-day.component.html',
  styleUrls: ['./add-product-watch-of-the-day.component.css']
})
export class AddProductWatchOfTheDayComponent {

  allData:any;
  watchDayForm: FormGroup;
  product_id: FormControl = new FormControl("", [Validators.required,]);
  background_color: FormControl = new FormControl("#000000", [Validators.required,]);
  type: FormControl = new FormControl("", [Validators.required,]);
  coverImage: { file: File; url: string } | null = null;
  detailsofProduct:any;
  param:any;

  constructor(private http: HttpService,private fb: FormBuilder,private alertService:AlertsServicesService,
      public dialogRef: MatDialogRef<AddProductWatchOfTheDayComponent>,
       @Inject(MAT_DIALOG_DATA) data: any
  ){
    // console.log("data",data)
    if(data){
    this.detailsofProduct=data.ProductDetails;
    this.param=data.param;
  }
  }

  ngOnInit(): void {
    this.allProducts();
    this.watchDayForm = this.fb.group({
      product_id: this.product_id,
      background_color: this.background_color,
      type: this.type,
    });

    if(this.param == 'Edit'){
      this.watchDayForm.get('product_id').setValue(this.detailsofProduct.product_id)
      this.watchDayForm.get('background_color').setValue(this.detailsofProduct.background_color)
      this.watchDayForm.get('type').setValue(this.detailsofProduct.type)
      this.coverImage={
        file:null,
        url: 'https://api.chronosouq.com/' + this.detailsofProduct.banner_img
      }
    }
  }

  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;

  selectCoverImage() {
    this.coverImageInput.nativeElement.click();
  }

  onCoverImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.alertService.showAlert(
          "warning",
          "The file is too large. Please select an image under 5MB."
        );
        return;
      }
      const allowedExtensions = ["jpeg", "png", "jpg", "gif", "svg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.alertService.showAlert(
          "warning",
          "Invalid file type. Please select an image with one of the following extensions: jpeg, png, jpg, gif, svg."
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.coverImage = { file, url: reader.result as string };
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage() {
    this.coverImage = null;
  }

  allProducts() {
    const queryString = {
      page: 1, // Set the page number
      per_page: 100 // Set the number of items per page
    };
      this.http.getAdminProductsofQuery(queryString).subscribe(
        (res) => {
          this.allData = res.data.data;
          this.allData = this.allData.map((product: any) => {
            if (product.main_image) {
              product.main_image = product.main_image
                .replace(/\\/g, "/")
                .replace(/^\/+/, "");
            }
            return product;
          });
        },
        (err) => {}
      );
    }


    cancelForm(){
      this.dialogRef.close()
    }

     // Save data
  saveData() {
   
    if (this.watchDayForm.valid && this.coverImage.file) {
      const formData = new FormData();
      formData.append('product_id', this.watchDayForm.get('product_id')?.value);
      formData.append('background_color', this.watchDayForm.get('background_color')?.value);
      formData.append('type', this.watchDayForm.get('type')?.value);
      formData.append('banner_img', this.coverImage.file);

      this.http.saveWatchOfTheDay(formData).subscribe(
        (response) => {
          this.alertService.showAlert('success','Add product into watch of the day')
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error saving data', error);
        }
      );
    } else {
      this.alertService.showAlert('warning','Add Form Values')
      console.log('Form is invalid');
    }
  }
}
