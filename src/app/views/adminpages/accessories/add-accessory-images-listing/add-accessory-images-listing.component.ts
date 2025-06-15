import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-add-accessory-images-listing',
  templateUrl: './add-accessory-images-listing.component.html',
  styleUrls: ['./add-accessory-images-listing.component.css']
})
export class AddAccessoryImagesListingComponent {
   apiUrl = environment.apipath+ '/';
   paramID: any;
   param: any;
   accessoryImagesForm: FormGroup;
   title_en: FormControl = new FormControl("", [Validators.required, Validators.maxLength(150)])
   title_ar: FormControl = new FormControl("", [Validators.required, Validators.maxLength(150)])
   description_en: FormControl = new FormControl("", [Validators.required, Validators.maxLength(500)])
   description_ar: FormControl = new FormControl("", [Validators.required, Validators.maxLength(500)])
   image: FormControl = new FormControl("", [Validators.required])
   imagePreview: string | ArrayBuffer | null = null;
   selectedFile: File | null = null;

  constructor(
    private http: HttpService,
    private fb: FormBuilder,
    private alertService: AlertsServicesService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddAccessoryImagesListingComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ){
    console.log(data)
    this.param = data.param;
    this.accessoryImagesForm = this.fb.group({
      title_en: this.title_en,
      title_ar: this.title_ar,
      description_en: this.description_en,
      description_ar: this.description_ar,
      image: this.image
    })

    if(this.param == "Edit"){
      this.paramID = data?.data?.id;
      this.accessoryImagesForm.patchValue(data.data);
      if(data.data.image) {
        this.imagePreview = this.apiUrl + data.data.image;
      }
      console.log(this.accessoryImagesForm.value)
    }
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.image.setValue(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  saveData(){
    if(this.accessoryImagesForm.valid){
      const formData = new FormData();
      formData.append('title_en', this.accessoryImagesForm.get('title_en')?.value);
      formData.append('title_ar', this.accessoryImagesForm.get('title_ar')?.value);
      formData.append('description_en', this.accessoryImagesForm.get('description_en')?.value);
      formData.append('description_ar', this.accessoryImagesForm.get('description_ar')?.value);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if(this.param == "Create"){
        this.http.addAccessoryImage(formData).subscribe((res)=>{
          console.log(res)
          this.alertService.showAlert('success',"Accessory Image Added Successfully");
          this.dialogRef.close(true);
        },(err)=>{
          console.log(err)
          this.alertService.showAlert('warning',"Something went wrong");
        })
      }
      else if(this.param == "Edit"){
        this.http.editAccessoryImage(formData, this.paramID).subscribe((res)=>{
          console.log(res)
          this.alertService.showAlert('success',"Accessory Image Updated Successfully");
          this.dialogRef.close(true);
        },(err)=>{
          console.log(err)
          this.alertService.showAlert('warning',"Something went wrong");
        })
      }
    }
  }

  cancelForm(){
    this.dialogRef.close();
  }
}