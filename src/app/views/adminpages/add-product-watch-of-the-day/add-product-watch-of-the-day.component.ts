import { Component,ElementRef,
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
  background_color: FormControl = new FormControl("", [Validators.required,]);
  type: FormControl = new FormControl("", [Validators.required,]);
  coverImage: { file: File; url: string } | null = null;

  constructor(private http: HttpService,private fb: FormBuilder,private alertService:AlertsServicesService,
      public dialogRef: MatDialogRef<AddProductWatchOfTheDayComponent>,
  ){}

  ngOnInit(): void {
    this.allProducts();
    this.watchDayForm = this.fb.group({
      product_id: this.product_id,
      background_color: this.background_color,
      type: this.type,
    });
  }

  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;

  selectCoverImage() {
    this.coverImageInput.nativeElement.click();
  }

  onCoverImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
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
      this.http.getAdminProducts().subscribe(
        (res) => {
          this.allData = res.data;
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
    console.log("form fields",this.watchDayForm.value)
    console.log("coverImage",this.coverImage)
    console.log("form fields valid",this.watchDayForm)
    if (this.watchDayForm.valid) {
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
      console.log('Form is invalid');
    }
  }
}
