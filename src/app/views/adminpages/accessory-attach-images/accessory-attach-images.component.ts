import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-accessory-attach-images',
  templateUrl: './accessory-attach-images.component.html',
  styleUrls: ['./accessory-attach-images.component.css']
})
export class AccessoryAttachImagesComponent implements OnInit{
  apiUrl = environment.apipath+ '/'
  data:any;
  accessoryImagesForm: FormGroup;
  selectedImageIds: number[] = [];
  
  constructor(
    private dialogRef: MatDialogRef<AccessoryAttachImagesComponent>,
    private http: HttpService,
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.data = data;

    this.accessoryImagesForm = this.fb.group({
      image_ids: [[], Validators.required],
    })
  }

  ngOnInit(): void {
    console.log(this.data);
    this.getAllImages();
  }

  imagesList:any[] = [];

  getAllImages(){
    this.http.getAllAccessoryImages().subscribe((res:any)=>{
      this.imagesList = res.map(item => ({
        ...item,
        image: item.image ? item.image.replace(/\\/g, "") : 'No image'
      }));
    })
  }

  onCheckboxChange(imageId: number, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedImageIds.includes(imageId)) {
        this.selectedImageIds.push(imageId);
      }
    } else {
      this.selectedImageIds = this.selectedImageIds.filter(id => id !== imageId);
    }
    
    // Update the form control value
    this.accessoryImagesForm.patchValue({
      image_ids: this.selectedImageIds
    });
  }

  isImageSelected(imageId: number): boolean {
    return this.selectedImageIds.includes(imageId);
  }

  cancelForm(){
    this.dialogRef.close(false);
  }

  attachImages(){
    console.log(this.accessoryImagesForm.value);
    this.http.attachImagesToAccessory(this.accessoryImagesForm.value,this.data.data.id).subscribe((res:any)=>{
      console.log(res);
      this.dialogRef.close(true);
    })
  }
}
