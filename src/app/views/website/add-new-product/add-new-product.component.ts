import {
  Component,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
} from "@angular/core";
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
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { LanguageService } from "src/services/lang-service/language.service";

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})
export class AddNewProductComponent implements OnInit {
  selectedSection: string = "listingDetails";
  isSmallScreen: boolean = false;
  panelOpenState = false;
  panelDialOpenState = false;
  panelStrapOpenState = false;
  coverImage: string | null = null; // Holds the URL of the cover image
  otherImages: Array<{ url: string; isUploading: boolean }> = []; // Holds the URLs and status of other images
  isCoverImageUploading: boolean = false;
  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild("otherImagesInput")
  otherImagesInput!: ElementRef<HTMLInputElement>;

  listingForm: FormGroup;
  watchDetailsForm: FormGroup;

  // Listing Form Details
  brand = new FormControl("", [
    Validators.required,
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  model = new FormControl("", [Validators.required]);
  title = new FormControl("", [Validators.required]);
  description = new FormControl("");
  watchType = new FormControl("");
  yearOfProduction = new FormControl("", [Validators.required]);
  approximation = new FormControl(false);
  unknown = new FormControl(false);

  // Watch Form Details

  referenceNo = new FormControl("", [
    Validators.required,
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  serialNo = new FormControl("", [
    Validators.required,
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  gender = new FormControl("", Validators.required);
  movement = new FormControl("", Validators.required);
  caseDiameter = new FormControl("", [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
  ]);
  otherDiameter = new FormControl("", [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
  ]);
  dialColor = new FormControl("");
  dialMaterial = new FormControl("");
  dialMarkers = new FormControl("");
  dialHands = new FormControl("");
  caseMaterial = new FormControl("");
  bezelMaterial = new FormControl("");
  thickness = new FormControl("", [
    Validators.pattern("^[0-9]*$"),
  ]);
  crystal = new FormControl("");
  braceletMaterial = new FormControl("");
  braceletColor = new FormControl("");
  claspType = new FormControl("");
  claspMaterial = new FormControl("");

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener("resize", () => this.checkScreenSize());

    // Listing Form
    this.listingForm = new FormGroup({
      brand: this.brand,
      model: this.model,
      title: this.title,
      description: this.description,
      watchType: this.watchType,
      yearOfProduction: this.yearOfProduction,
      approximation: this.approximation,
      unknown: this.unknown,
    });

    this.watchDetailsForm = new FormGroup({
      referenceNo: this.referenceNo,
      serialNo: this.serialNo,
      gender: this.gender,
      movement: this.movement,
      caseDiameter: this.caseDiameter,
      otherDiameter: this.otherDiameter,
      dialColor: this.dialColor,
      dialMaterial: this.dialMaterial,
      dialMarkers: this.dialMarkers,
      dialHands: this.dialHands,
      caseMaterial: this.caseMaterial,
      bezelMaterial: this.bezelMaterial,
      thickness: this.thickness,
      crystal: this.crystal,
      braceletMaterial: this.braceletMaterial,
      braceletColor: this.braceletColor,
      claspType: this.claspType,
      claspMaterial: this.claspMaterial,
    });
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  selectCoverImage() {
    this.coverImageInput.nativeElement.click();
  }

  selectOtherImages() {
    this.otherImagesInput.nativeElement.click();
  }

  onCoverImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isCoverImageUploading = true; // Start uploading

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.coverImage = reader.result as string;
          this.isCoverImageUploading = false; // End uploading
        }, 3000); // 10 seconds delay
      };

      reader.readAsDataURL(file);
    }
  }

  removeCoverImage() {
    this.coverImage = null;
    this.isCoverImageUploading = false; // Reset uploading state
  }

  onOtherImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const newImage = { url: "", isUploading: true };
        this.otherImages.push(newImage);

        reader.onload = () => {
          newImage.url = reader.result as string;

          setTimeout(() => {
            newImage.isUploading = false;
          }, 3000);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(image: { url: string; isUploading: boolean }) {
    this.otherImages = this.otherImages.filter((img) => img !== image);
  }

  onSubmit(Param: string) {
    if (Param === "listing" && this.listingForm.valid) {
      console.log(this.listingForm.value);
      this.selectSection('watchDetails')
    }
    else if(Param === 'watchDetails' && this.watchDetailsForm.valid){
       console.log(this.watchDetailsForm.value)
       this.selectSection('uploadImages')
    }

    else if (Param === 'uploadImages'){
      if (!this.coverImage) {
        alert("Please upload a cover image.");
        return;
      }
  
      if (this.otherImages.length === 0) {
        alert("Please upload at least one other image.");
        return;
      }
      console.log("Cover Image:", this.coverImage);
      console.log("Other Images:", this.otherImages.map(image => image.url));
    }
  }
}
