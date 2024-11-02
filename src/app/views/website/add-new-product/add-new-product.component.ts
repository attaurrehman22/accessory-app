import { Component, OnInit, signal,ElementRef,ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../../auth/login/login.component";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { LanguageService } from "src/services/lang-service/language.service";


@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})
export class AddNewProductComponent implements OnInit {
  selectedSection: string = 'watchDetails';
  isSmallScreen: boolean = false;
  panelOpenState = false;
  panelDialOpenState = false;
  panelStrapOpenState = false;

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }


  coverImage: string | null = null; // Holds the URL of the cover image
  otherImages: Array<{ url: string, isUploading: boolean }> = []; // Holds the URLs and status of other images

  @ViewChild('coverImageInput') coverImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('otherImagesInput') otherImagesInput!: ElementRef<HTMLInputElement>;

  // Open the file dialog for cover image selection
  selectCoverImage() {
    this.coverImageInput.nativeElement.click();
  }

  // Open the file dialog for other images selection
  selectOtherImages() {
    this.otherImagesInput.nativeElement.click();
  }

  // Handle cover image selection
  onCoverImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.coverImage = reader.result as string;
      };

      
            setTimeout(() => {
              this.coverImage = reader.result as string;
            }, 10000);
      reader.readAsDataURL(file);
  
    }
  }

  // Handle other images selection
  onOtherImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        const newImage = { url: '', isUploading: true };
        this.otherImages.push(newImage);
        
        reader.onload = () => {
          newImage.url = reader.result as string;
          
          setTimeout(() => {
            newImage.isUploading = false;
          }, 5000); 
        };
        
        reader.readAsDataURL(file);
      });
    }
  }


  // Remove an image from the other images array
  removeImage(image: { url: string, isUploading: boolean }) {
    this.otherImages = this.otherImages.filter(img => img !== image);
  }
}

