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

interface ImageFile {
  file: File;
  url: string;
  isUploading: boolean;
}

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})
export class AddNewProductComponent implements OnInit {
  selectedSection: string = "billinginformation";
  isSmallScreen: boolean = false;
  panelOpenState = false;
  panelDialOpenState = false;
  panelStrapOpenState = false;
  coverImage: { file: File; url: string } | null = null;
  otherImages: ImageFile[] = [];
  isCoverImageUploading = false;
  productIDFromResponse:any;
  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild("otherImagesInput")
  otherImagesInput!: ElementRef<HTMLInputElement>;

  listingForm: FormGroup;
  watchDetailsForm: FormGroup;
  billingForm: FormGroup;

  // Listing Form Details
  brand_id = new FormControl(0 , [Validators.required]);
  category_ids = new FormControl([] , [Validators.required]);
  name = new FormControl("", [Validators.required]);
  model = new FormControl("", [Validators.required]);
  title = new FormControl("", [Validators.required]);
  description = new FormControl("");
  watchType = new FormControl("");
  yearOfProduction = new FormControl("", [Validators.required]);
  approximation = new FormControl(false);
  unknown = new FormControl(false);

  // Watch Form Details

  reference_number = new FormControl("", [
    Validators.required,
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  serial_no = new FormControl("", [
    Validators.required,
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  gender = new FormControl("", Validators.required);
  movement = new FormControl("", Validators.required);
  case_diameter_value_1 = new FormControl(null , [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
  ]);
  case_diameter_value_2 = new FormControl(null, [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
  ]);
  dial_color = new FormControl("");
  caliber_movement = new FormControl("");
  base_caliber = new FormControl("");
  power_reserve = new FormControl("");
  no_of_jewels = new FormControl();
  frequency = new FormControl("");
  additional_details = new FormControl("");

  case_material = new FormControl("");
  bezel_material = new FormControl("");
  thickness = new FormControl(null, [Validators.pattern("^[0-9]*$")]);
  crystal = new FormControl("");
  water_resistance = new FormControl("");

  dial_numerals = new FormControl("");
  bracelet_material = new FormControl("");
  bracelet_color = new FormControl("");
  type_of_clasp = new FormControl("");
  clasp_material = new FormControl("");



  // Billing Information Form Details

  billing_address = new FormControl("", [Validators.required]);
  first_name = new FormControl("", [Validators.required]);
  last_name = new FormControl("", [Validators.required]);
  street = new FormControl("", [Validators.required]);
  street_line_2 = new FormControl("");
  zip_code = new FormControl("", [Validators.required]);
  city = new FormControl("", [Validators.required]);

  cities = ["City 1", "City 2", "City 3"];

  constructor(private http: HttpService,private alertService:AlertsServicesService) {}

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

  selectedOptions: string='';

  toggleOption(option: any) {
    this.selectedOptions=option.title
    console.log("option",option)
    console.log("this.selectedOptions",this.selectedOptions)
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

  brandsList:any;
  categoryList:any;
  getAllBrandsDropDown(){
    this.http.getAllBrandsDropdDown().subscribe(
      (res)=>{
        this.brandsList=res.data
      }
    )
  }

  getCategoriesDropDown(){
    this.http.getCategoryDropDown().subscribe(
      (res)=>{
        this.categoryList=res.data
      }
    )
  }

  ngOnInit() {
    this.checkScreenSize();
    this.getAllBrandsDropDown();
    this.getCategoriesDropDown();
    window.addEventListener("resize", () => this.checkScreenSize());
    this.generateRandomClocks(2);

    // Listing Form
    this.listingForm = new FormGroup({
      brand_id: this.brand_id,
      category_ids: this.category_ids,
      name: this.name,
      model: this.model,
      title: this.title,
      description: this.description,
      watchType: this.watchType,
      yearOfProduction: this.yearOfProduction,
      approximation: this.approximation,
      unknown: this.unknown, 
    });

    this.watchDetailsForm = new FormGroup({
      product_id: new FormControl(this.productIDFromResponse || ''),
      reference_number: this.reference_number,
      serial_no: this.serial_no,
      gender: this.gender,
      movement: this.movement,
      case_diameter_value_1: this.case_diameter_value_1,
      case_diameter_value_2: this.case_diameter_value_2,
      dial_color: this.dial_color,
      caliber_movement: this.caliber_movement,
      base_caliber: this.base_caliber,
      power_reserve: this.power_reserve,
      no_of_jewels: this.no_of_jewels,
      frequency: this.frequency,
      additional_details: this.additional_details,
      case_material: this.case_material,
      bezel_material: this.bezel_material,
      thickness: this.thickness,
      crystal: this.crystal,
      water_resistance: this.water_resistance,
      dial_numerals: this.dial_numerals,
      bracelet_material: this.bracelet_material,
      bracelet_color: this.bracelet_color,
      type_of_clasp: this.type_of_clasp,
      clasp_material: this.clasp_material
    });

    this.billingForm = new FormGroup({
      billing_address: this.billing_address,
      first_name: this.first_name,
      last_name: this.last_name,
      street: this.street,
      street_line_2: this.street_line_2,
      zip_code: this.zip_code,
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
      this.isCoverImageUploading = true;

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          // Store both file and URL for preview and upload
          this.coverImage = { file, url: reader.result as string };
          this.isCoverImageUploading = false;
        }, 3000); // Simulate upload delay
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
        const newImage: ImageFile = { file, url: '', isUploading: true };
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
    if (Param === "listingDetails") {
      console.log(this.listingForm.value);
      if(this.listingForm.valid){
         this.http.addListingDetails(this.listingForm.value).subscribe(
          (res)=>{
            this.productIDFromResponse=res.data.id;
            this.alertService.showAlert('success','Listing Details Add Successfully')
        
          },(err)=>{
            this.alertService.showAlert('danger','Error in adding listing details')
          }
         )
      }else{
        this.alertService.showAlert('warning','Enter Form Values')
      }
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
      const formData = new FormData();
      if (this.coverImage && this.coverImage.file) {
         formData.append("main_image", this.coverImage.file, this.coverImage.file.name || "main_image.jpg");
      }
      this.otherImages.forEach((image, index) => {
         if (image.file) {
            formData.append(`additional_images[]`, image.file, image.file.name || `additional_image_${index}.jpg`);
         }
      });

      // Log formData entries for verification
      formData.forEach((value, key) => console.log(key, value));

      this.selectSection("conditionGrading");
    } else if (Param === "conditionGrading") {
      console.log(this.selectedCondition);
      this.selectSection("scopeofdelivery");
    } else if (Param === "scopeofdelivery") {

     const formData ={
      product_id: new FormControl(this.productIDFromResponse || ''),
      scope_of_delivery:this.selectedOptions
      }
      console.log(formData);
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


  cancelbtn(){}


  backbtn(param:string){
    this.selectSection(param);
  }
}
