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
import { CanComponentDeactivate } from "src/app/can-deactivate-form.guard";

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
export class AddNewProductComponent implements OnInit, CanComponentDeactivate {
  selectedSection: string = "listingDetails";
  formDirty = false;
  isSmallScreen: boolean = false;
  panelOpenState = false;
  panelDialOpenState = false;
  panelStrapOpenState = false;
  coverImage: { file: File; url: string } | null = null;
  otherImages: ImageFile[] = [];
  isCoverImageUploading = false;
  productIDFromResponse: any;
  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild("otherImagesInput")
  otherImagesInput!: ElementRef<HTMLInputElement>;

  listingForm: FormGroup;
  watchDetailsForm: FormGroup;
  billingForm: FormGroup;

  // Listing Form Details

  brand_id = new FormControl(null, [Validators.required]);
  category_ids = new FormControl([], [Validators.required]);
  name = new FormControl("", [Validators.required]);
  model = new FormControl("", [Validators.required]);
  title = new FormControl("", [Validators.required]);
  description = new FormControl("");
  watch_type = new FormControl("", [Validators.required]);
  year_of_production = new FormControl("", [Validators.required]);
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
  case_diameter_value_1 = new FormControl(null, [
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

  constructor(
    private http: HttpService,
    private alertService: AlertsServicesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  watchPrice: number = 0;
  shipping_type: any;
  shipping_charges: number = 0;
  estimate_delivery: any;
  allow_to_make_offer: false;
  watchPriceDisplay: number = 0;
  platformFee: number = 0;
  estimatedPayout: number = 0;
  estimatedPayoutwithShipping: number = 0;
  calculatePayout() {
    this.watchPriceDisplay = this.watchPrice;
    this.platformFee = this.watchPrice * 0.04;
    this.estimatedPayout = this.watchPrice - this.platformFee;
  }

  Payoutaftershippingcharges() {
    this.estimatedPayoutwithShipping =
      this.estimatedPayout - this.shipping_charges;
  }

  clocks: { hour: number; minute: number }[] = [];

  generateRandomClocks(count: number) {
    this.clocks = Array.from({ length: count }, () => {
      const hour = Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      return { hour, minute };
    });
  }

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
      title: "Watch only",
      icon: "../assets/images/original-box-papers.png",
    },
    {
      title: "Watch with original box",
      icon: "../assets/images/original-box.png",
    },
    {
      title: "Watch with original papers",
      icon: "/assets/images/original-papers.png",
    },
    {
      title: "Watch with original box and papers",
      icon: "/assets/images/watch-only.png",
    },
  ];

  selectedOptions: any;

  toggleOption(option: any) {
    this.selectedOptions = option;
  }

  isSelected(option: any): boolean {
    if (this.selectedOptions === option) {
      return true;
    } else {
      return false;
    }
  }

  conditions = [
    {
      title: "New",
      description:
        "The item has no signs of wear such as scratches or dents and is unworn. The item has not been polished.",
    },
    {
      title: "Like new and unworn",
      description:
        "The item shows minor signs of wear, such as small but physically imperceptible scratches.",
    },
    {
      title: "Used",
      description:
        "The item shows visible and physically perceptible signs of wear such as scratches, scuffs or small dents.",
    },
    {
      title: "Very good (minor signs of wear)",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
    },
    {
      title: "Good (moderate signs of wear)",
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

  brandsList: any;
  categoryList: any;
  getAllBrandsDropDown() {
    this.http.getAllBrandsDropdDown().subscribe((res) => {
      this.brandsList = res.data;
    });
  }

  getCategoriesDropDown() {
    this.http.getCategoryDropDown().subscribe((res) => {
      this.categoryList = res.data;
    });
  }

  formdropdownListData: any = {};

  allDropDownData() {
    this.http.getallDropDownformData().subscribe((res) => {
      this.formdropdownListData = res.data;
      this.formdropdownListData.watch_type = Object.entries(
        res.data.watch_type
      ).map(([key, value]) => ({ key, value }));
      this.formdropdownListData.gender = Object.entries(res.data.gender).map(
        ([key, value]) => ({ key, value })
      );
      this.formdropdownListData.movement = Object.entries(
        res.data.movement
      ).map(([key, value]) => ({ key, value }));
      this.formdropdownListData.case_material = Object.entries(
        res.data.case_material
      ).map(([key, value]) => ({ key, value }));
      this.formdropdownListData.bezel_material = Object.entries(
        res.data.bezel_material
      ).map(([key, value]) => ({ key, value }));
      this.formdropdownListData.crystal = Object.entries(res.data.crystal).map(
        ([key, value]) => ({ key, value })
      );
      this.formdropdownListData.water_resistance = Object.entries(
        res.data.water_resistance
      ).map(([key, value]) => ({ key, value }));
    });
  }

  canDeactivate(): boolean {
    if (this.formDirty) {
      return window.confirm("Are You Sure You Want to Cancel Form");
    }
    return true;
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  isProductID: any;

  ngOnInit() {
    const isUserLogin = localStorage.getItem("Logged");
    if (!isUserLogin) {
      // this.loginFirst()
    }
    if (history?.state?.ID) {
      this.productIDFromResponse = history.state.ID;
      this.selectedSection = "summary";
      this.calculatePayout();
      this.formDirty = true;
    }

    this.checkScreenSize();
    this.getAllBrandsDropDown();
    this.getCategoriesDropDown();
    this.allDropDownData();
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
      watch_type: this.watch_type,
      year_of_production: this.year_of_production,
      approximation: this.approximation,
      unknown: this.unknown,
    });

    this.watchDetailsForm = new FormGroup({
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
      clasp_material: this.clasp_material,
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

    const listing_Form = sessionStorage.getItem("listingForm");
    if (listing_Form) {
      this.listingForm.setValue(JSON.parse(listing_Form));
    }

    const watch_Form = sessionStorage.getItem("watchDetailsForm");
    if (watch_Form) {
      this.watchDetailsForm.setValue(JSON.parse(watch_Form));
    }

    const billing_Form = sessionStorage.getItem("billingForm");
    if (billing_Form) {
      this.billingForm.setValue(JSON.parse(billing_Form));
    }

    const cond = sessionStorage.getItem("condition");
    if (cond) {
      const selectedConditionData = JSON.parse(cond);
      const matchingCondition = this.conditions.find(
        (condition) =>
          condition.title === selectedConditionData.title &&
          condition.description === selectedConditionData.description
      );
      if (matchingCondition) {
        this.selectCondition(matchingCondition);
      }
    }

    const scope_of_del = sessionStorage.getItem("scope_of_delivery");
    if (scope_of_del) {
      const selectedOptionData = JSON.parse(scope_of_del);

      const matchingOption = this.options.find(
        (option) => option.title === selectedOptionData.title
      );

      if (matchingOption) {
        this.selectedOptions = matchingOption;
      }
    }

    const price_ship = sessionStorage.getItem("priceandShipment");
    if (price_ship) {
      const parsedData = JSON.parse(price_ship);
      this.watchPrice = parsedData.price;
      this.shipping_type = parsedData.shipping_type;
      this.shipping_charges = parsedData.shipping_charges;
      this.estimate_delivery = parsedData.estimate_delivery;
      this.allow_to_make_offer = parsedData.allow_to_make_offer;
      this.estimatedPayoutwithShipping = parsedData.estimate_payout;
      this.calculatePayout();
    }

    const coverImage = sessionStorage.getItem("coverImage");
    if (coverImage) {
      const parsedCoverImage = JSON.parse(coverImage);
      this.coverImage = { file: null, url: parsedCoverImage.url };
    }

    const otherImages = sessionStorage.getItem("otherImages");
    if (otherImages) {
      this.otherImages = JSON.parse(otherImages).map(
        (img: { url: string }) => ({
          file: null,
          url: img.url,
          isUploading: false,
        })
      );
    }

    const savedData = sessionStorage.getItem("proofofownership");
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      // Load times for each clock
      this.clocks = parsedData.map((data: any) => data.time);

      this.imagePreviews = parsedData.map((data: any) => data.image?.content || '');

      this.selectedFiles = parsedData.map((data: any, index: number) => {
        if (data.image && data.image.content) {
          const byteString = atob(data.image.content.split(",")[1]); // Decode base64
          const mimeString = data.image.content.split(",")[0].split(":")[1].split(";")[0];
          
          const byteArray = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
          }
          return new File([byteArray], `clock_image_${index + 1}.png`, { type: mimeString });
        }
        return null;
      });
    }

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
        const newImage: ImageFile = { file, url: "", isUploading: true };
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

  brandnametoDisplay: any;

  matchBrandname() {
    let SelectedbrandID = this.listingForm.get("brand_id").value;
    const selectedBrand = this.brandsList.find(
      (brand) => brand.id === SelectedbrandID
    );
    this.brandnametoDisplay = selectedBrand ? selectedBrand.name : null;
  }

  onSubmit(Param: string) {
    if (Param === "listingDetails") {
      console.log(this.listingForm.value);
      if (this.listingForm.valid) {
        this.http.addListingDetails(this.listingForm.value).subscribe(
          (res) => {
            this.productIDFromResponse = res.id;
            this.alertService.showAlert(
              "success",
              "Listing Details Add Successfully"
            );
            this.formDirty = true;
            this.selectSection("watchDetails");
          },
          (err) => {
            this.alertService.showAlert(
              "danger",
              "Error in adding listing details"
            );
          }
        );
      } else {
        this.alertService.showAlert("warning", "Enter Form Values");
      }
    } else if (Param === "watchDetails") {
      if (this.watchDetailsForm.valid) {
        const formDataWithProductID = {
          ...this.watchDetailsForm.value,
          product_id: this.productIDFromResponse,
        };

        this.http.addWatchDetails(formDataWithProductID).subscribe(
          (res) => {
            this.alertService.showAlert(
              "success",
              "Watch Details Add Successfully"
            );
            this.selectSection("uploadImages");
          },
          (err) => {
            this.alertService.showAlert(
              "danger",
              "Error in adding listing details"
            );
          }
        );
      } else {
        this.alertService.showAlert("warning", "Enter Required Form Values");
      }
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
      formData.append("product_id", this.productIDFromResponse);
      if (this.coverImage && this.coverImage.file) {
        formData.append(
          "main_image",
          this.coverImage.file,
          this.coverImage.file.name || "main_image.jpg"
        );
      }
      this.otherImages.forEach((image, index) => {
        if (image.file) {
          formData.append(
            `additional_images[]`,
            image.file,
            image.file.name || `additional_image_${index}.jpg`
          );
        }
      });
      formData.forEach((value, key) => console.log(key, value));

      this.http.addUploadImages(formData).subscribe(
        (res) => {
          this.alertService.showAlert("success", "Images Add Successfully");
          this.selectSection("conditionGrading");
        },
        (err) => {
          this.alertService.showAlert("danger", "Error in adding Images");
        }
      );
    } else if (Param === "conditionGrading") {
      if (this.selectedCondition) {
        const formData = {
          product_id: this.productIDFromResponse,
          condition: this.selectedCondition.title,
        };

        this.http.addCondition(formData).subscribe(
          (res) => {
            this.alertService.showAlert(
              "success",
              "Condition Add Successfully"
            );
            this.selectSection("scopeofdelivery");
          },
          (err) => {
            this.alertService.showAlert("danger", "Error in adding Condition");
          }
        );
      } else {
        this.alertService.showAlert("warning", "Select any Option");
      }
    } else if (Param === "scopeofdelivery") {
      if (this.selectedOptions) {
        const formData = {
          product_id: this.productIDFromResponse,
          scope_of_delivery: this.selectedOptions.title,
        };
        this.http.addScopeOfDelivery(formData).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Scope Add Successfully");
            this.selectSection("proofofownership");
          },
          (err) => {
            this.alertService.showAlert("danger", "Error in adding Scope");
          }
        );
      } else {
        this.alertService.showAlert("warning", "Select any Option");
      }
    } else if (Param === "proofofownership") {
      if (!this.selectedFiles[0] || !this.selectedFiles[1]) {
        this.alertService.showAlert("warning", "Add Images");
      } else {
        // Create FormData to send with the API request
        const formData = new FormData();
      
        // Append product ID if available
        formData.append("product_id", this.productIDFromResponse);
      
        // Append proof images
        formData.append("proof_image_1", this.selectedFiles[0]);
        formData.append("proof_image_2", this.selectedFiles[1]);
      
        // Append proof times based on selected clock times
        formData.append("proof_time_text_1", this.formatTime(this.clocks[0].hour, this.clocks[0].minute));
        formData.append("proof_time_text_2", this.formatTime(this.clocks[1].hour, this.clocks[1].minute));
      
        // Optionally, append generated times if different (for now, using the same as proof times)
        formData.append("generted_time_text_1", this.formatTime(this.clocks[0].hour, this.clocks[0].minute));
        formData.append("generted_time_text_2", this.formatTime(this.clocks[1].hour, this.clocks[1].minute));
      
        // Call the API with the populated FormData
        this.http.addProffofOwnerShip(formData).subscribe(
          (res) => {
            this.alertService.showAlert("success", "Images Added Successfully");
            this.selectSection("priceshipment");
          },
          (err) => {
            this.alertService.showAlert("danger", "Error in adding Images");
          }
        );
      }
    } else if (Param === "priceshipment") {
      console.log("Price and Shipent", this.watchPrice);

      if (
        !this.watchPrice ||
        !this.shipping_type ||
        !this.shipping_charges ||
        !this.estimate_delivery ||
        !this.estimatedPayoutwithShipping
      ) {
        this.alertService.showAlert("info", "Enter Form Values");
      } else {
        const formData = {
          product_id: this.productIDFromResponse,
          price: this.watchPrice,
          shipping_type: this.shipping_type,
          shipping_charges: this.shipping_charges,
          estimate_delivery: this.estimate_delivery,
          allow_to_make_offer: this.allow_to_make_offer,
          estimate_payout: this.estimatedPayoutwithShipping,
        };
        this.http.addpriceAndShipment(formData).subscribe(
          (res) => {
            this.alertService.showAlert(
              "success",
              "Price and Shipment Add Successfully"
            );
            this.selectSection("billinginformation");
          },
          (err) => {
            this.alertService.showAlert(
              "danger",
              "Error in adding Price and Shipment"
            );
          }
        );
      }
    } else if (Param === "billinginformation") {
      if (this.billingForm.valid) {
        const formDataWithProductID = {
          ...this.billingForm.value,
          product_id: this.productIDFromResponse,
        };

        this.http.addbillingInformation(formDataWithProductID).subscribe(
          (res) => {
            this.alertService.showAlert(
              "success",
              "Billing Info Add Successfully"
            );
            this.matchBrandname();
            this.selectSection("summary");
          },
          (err) => {
            this.alertService.showAlert(
              "danger",
              "Error in adding Billing Info"
            );
          }
        );
      } else {
        this.alertService.showAlert("warning", "Add Form Values");
      }
    } else if (Param === "summary") {
      const formProductID = {
        product_id: this.productIDFromResponse,
      };
      this.http.addbpublishListing(formProductID).subscribe(
        (res) => {
          this.alertService.showAlert(
            "success",
            "Product Publish Successfully"
          );
          this.formDirty = false;
          sessionStorage.clear();
          this.router.navigate(["/"]);
        },
        (err) => {
          this.alertService.showAlert("danger", "Error in Product Publishing");
        }
      );
    }
  }

  cancelbtn() {
    this.router.navigate(["/"]);
  }

  backbtn(param: string) {
    this.selectSection(param);
  }

  async routeToProductDetail() {
    sessionStorage.setItem(
      "listingForm",
      JSON.stringify(this.listingForm.value)
    );
    sessionStorage.setItem(
      "watchDetailsForm",
      JSON.stringify(this.watchDetailsForm.value)
    );
    sessionStorage.setItem(
      "billingForm",
      JSON.stringify(this.billingForm.value)
    );
    sessionStorage.setItem("condition", JSON.stringify(this.selectedCondition));
    sessionStorage.setItem(
      "scope_of_delivery",
      JSON.stringify(this.selectedOptions)
    );
    const priceandShipment = {
      price: this.watchPrice,
      shipping_type: this.shipping_type,
      shipping_charges: this.shipping_charges,
      estimate_delivery: this.estimate_delivery,
      allow_to_make_offer: this.allow_to_make_offer,
      estimate_payout: this.estimatedPayoutwithShipping,
    };
    sessionStorage.setItem(
      "priceandShipment",
      JSON.stringify(priceandShipment)
    );

    if (this.coverImage) {
      const coverImageData = { url: this.coverImage.url }; // Exclude file property
      sessionStorage.setItem("coverImage", JSON.stringify(coverImageData));
    }

    const otherImagesData = this.otherImages.map((image) => ({
      url: image.url,
    }));
    sessionStorage.setItem("otherImages", JSON.stringify(otherImagesData));

    const fileDataArray = await Promise.all(
      this.selectedFiles.map(async (file, index) => {
        if (file) {
          const base64 = await this.convertFileToBase64(file);
          return {
            image: {
              name: file.name,
              type: file.type,
              size: file.size,
              content: base64,
            },
            time: this.clocks[index],
          };
        }
        return null; 
      })
    );

    const cleanedFileDataArray = fileDataArray.filter(
      (fileData) => fileData !== null
    );

    if (cleanedFileDataArray.length > 0) {
      sessionStorage.setItem(
        "proofofownership",
        JSON.stringify(cleanedFileDataArray)
      );
    } else {
      sessionStorage.removeItem("proofofownership");
    }
    this.formDirty = false;
    this.router.navigate(["/buy-product"], {
      state: { param: "listing-to-product", ID: this.productIDFromResponse },
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
