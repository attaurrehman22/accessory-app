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
  selectedSection: string = "summary";
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
  billingForm: FormGroup;

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
  thickness = new FormControl("", [Validators.pattern("^[0-9]*$")]);
  crystal = new FormControl("");
  braceletMaterial = new FormControl("");
  braceletColor = new FormControl("");
  claspType = new FormControl("");
  claspMaterial = new FormControl("");

  // Billing Information Form Details

  billingAddress = new FormControl("", [Validators.required]);
  firstName = new FormControl("", [Validators.required]);
  lastName = new FormControl("", [Validators.required]);
  street = new FormControl("", [Validators.required]);
  streetLine2 = new FormControl("");
  zipCode = new FormControl("", [Validators.required]);
  city = new FormControl("", [Validators.required]);

  cities = ["City 1", "City 2", "City 3"];

  constructor(private http: HttpService) {}

  watchPrice: number = 0;
  watchPriceDisplay: number = 0;
  platformFee: number = 0;
  estimatedPayout: number = 0;

  calculatePayout() {
    this.watchPriceDisplay = this.watchPrice;
    this.platformFee = this.watchPrice * 0.04;
    this.estimatedPayout = this.watchPrice - this.platformFee;
  }

  clocks: { hour: number; minute: number }[] = [];

  generateRandomClocks(count: number) {
    this.clocks = Array.from({ length: count }, () => {
      const hour = Math.floor(Math.random() * 12); // Random hour from 0 to 11
      const minute = Math.floor(Math.random() * 60); // Random minute from 0 to 59
      return { hour, minute };
    });
  }

  // Function to format time for display (e.g., 03:05 instead of 3:5)
  formatTime(hour: number, minute: number): string {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
  }

  @ViewChild("fileInput0") fileInput0!: ElementRef<HTMLInputElement>;
  @ViewChild("fileInput1") fileInput1!: ElementRef<HTMLInputElement>;
  imagePreviews: string[] = ["", ""];
  selectedFiles: File[] = [null, null];
  triggerFileInput(clockIndex: number): void {
    if (clockIndex === 0) {
      this.fileInput0.nativeElement.click();
    } else if (clockIndex === 1) {
      this.fileInput1.nativeElement.click();
    }
  }

  onFileSelected(event: Event, clockIndex: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.selectedFiles[clockIndex] = file; // Store the selected file
      console.log(`Selected file for clock ${clockIndex + 1}:`, file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews[clockIndex] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  options = [
    {
      title: "Original Box & Original Papers",
      icon: "../assets/images/original-box-papers.png",
    },
    { title: "Original Box", icon: "../assets/images/original-box.png" },
    { title: "Original Papers", icon: "/assets/images/original-papers.png" },
    { title: "Watch Only", icon: "/assets/images/watch-only.png" },
  ];

  selectedOptions: any[] = [];

  toggleOption(option: any) {
    const index = this.selectedOptions.indexOf(option);
    if (index === -1) {
      this.selectedOptions.push(option); // Add to selection
    } else {
      this.selectedOptions.splice(index, 1); // Remove from selection
    }
  }

  isSelected(option: any): boolean {
    return this.selectedOptions.includes(option);
  }

  conditions = [
    {
      title: "Like New & Unworn",
      description:
        "The item has no signs of wear such as scratches or dents and is unworn. The item has not been polished.",
    },
    {
      title: "Very Good",
      description:
        "The item shows minor signs of wear, such as small but physically imperceptible scratches.",
    },
    {
      title: "Good",
      description:
        "The item shows visible and physically perceptible signs of wear such as scratches, scuffs or small dents.",
    },
    {
      title: "Fair",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
    },
    {
      title: "Incomplete",
      description: "The item is missing some parts and is not functional.",
    },
  ];

  selectedCondition = null;

  selectCondition(condition: any) {
    this.selectedCondition = condition;
  }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener("resize", () => this.checkScreenSize());
    this.generateRandomClocks(2);

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

    this.billingForm = new FormGroup({
      billingAddress: this.billingAddress,
      firstName: this.firstName,
      lastName: this.lastName,
      street: this.street,
      streetLine2: this.streetLine2,
      zipCode: this.zipCode,
      city: this.city,
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
      this.selectSection("watchDetails");
    } else if (Param === "watchDetails" && this.watchDetailsForm.valid) {
      console.log(this.watchDetailsForm.value);
      this.selectSection("uploadImages");
    } else if (Param === "uploadImages") {
      if (!this.coverImage) {
        alert("Please upload a cover image.");
        return;
      }

      if (this.otherImages.length === 0) {
        alert("Please upload at least one other image.");
        return;
      }
      console.log("Cover Image:", this.coverImage);
      console.log(
        "Other Images:",
        this.otherImages.map((image) => image.url)
      );

      this.selectSection("conditionGrading");
    } else if (Param === "conditionGrading") {
      console.log(this.selectedCondition);
      this.selectSection("scopeofdelivery");
    } else if (Param === "scopeofdelivery") {
      console.log(this.selectedOptions);
      this.selectSection("proofofownership");
    } else if (Param === "proofofownership") {
      console.log("Selected files for 'proofofownership':", this.selectedFiles);

      // Display each file separately in the console
      this.selectedFiles.forEach((file, index) => {
        if (file) {
          console.log(`File for Clock ${index + 1}:`, file);
        } else {
          console.log(`No file selected for Clock ${index + 1}`);
        }
      });

      this.selectSection("priceshipment");
    } else if (Param === "priceshipment") {
      console.log("Price and Shipent", this.watchPrice);

      this.selectSection("billinginformation");
    } else if (Param === "billinginformation") {
      console.log("Form Submitted", this.billingForm.value);

      this.selectSection("summary");
    } else if (Param === "summary") {
      console.log("-----------");
    }
  }
}
