import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { LoginStateService } from "src/services/login-service/login-state.service";

export interface Brand {
  name: string;
  id: any;
}

export interface Category {
  name: string;
  id: any;
}

interface ImageFile {
  file: File;
  url: string;
  isUploading: boolean;
}


@Component({
  selector: "app-create-accessories-product",
  templateUrl: "./create-accessories-product.component.html",
  styleUrls: ["./create-accessories-product.component.css"],
})
export class CreateAccessoriesProductComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;


  dealerconditions = [
    {
      title: "New",
      description:
        "The item has no signs of wear such as scratches or dents and is unworn. The item has not been polished.",
        arabictitle: "جديد",
        arabicdescription: "العنصر ليس به أي علامات تآكل مثل الخدوش أو الانبعاجات ولم يُستخدم. لم يتم تلميع العنصر."
    },
    {
      title: "Like new and unworn",
      description:
        "The item shows minor signs of wear, such as small but physically imperceptible scratches.",
         arabictitle: "كالجديد وغير مُستخدم",
         arabicdescription: "يظهر العنصر علامات تآكل طفيفة، مثل خدوش صغيرة لكنها غير محسوسة جسديًا."
    },
    {
      title: "Used",
      description:
        "The item shows visible and physically perceptible signs of wear such as scratches, scuffs or small dents.",
        arabictitle: "مُستخدم",
        arabicdescription: "يظهر العنصر علامات تآكل مرئية ومحسوسة جسديًا مثل الخدوش أو الحكات أو الانبعاجات الصغيرة."
    },
    {
      title: "Very good (minor signs of wear)",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
         arabictitle: "جيد جدًا (علامات تآكل طفيفة)",
         arabicdescription: "يظهر العنصر علامات تآكل كبيرة ومرئية مثل الخدوش والانبعاجات."
    },
    {
      title: "Good (moderate signs of wear)",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
        arabictitle: "جيد (علامات تآكل متوسطة)",
        arabicdescription: "يظهر العنصر علامات تآكل كبيرة ومرئية مثل الخدوش والانبعاجات."
    },
    {
      title: "Incomplete",
      description: "The item is missing some parts and is not functional.",
      arabictitle: "غير مكتمل",
      arabicdescription: "العنصر يفتقد بعض الأجزاء وغير قابل للاستخدام."
    },
  ];


  options = [
    {
      title: "Original Box & Original Papers",
      icon: "../assets/images/original-box-papers.png",
      arabictitle: "الصندوق الأصلي والأوراق الأصلية"
    },
    {
      title: "Original Box",
      icon: "../assets/images/original-box.png",
      arabictitle: "الصندوق الأصلي"
    },
    {
      title: "Original Papers",
      icon: "/assets/images/original-papers.png",
      arabictitle: "الأوراق الأصلية"
    },
    {
      title: "Watch Only",
      icon: "/assets/images/watch-only.png",
      arabictitle: "الساعة فقط"
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

  listingForm: FormGroup;
  // Listing Form Details

  brand_id = new FormControl(null, Validators.required);
  category_ids = new FormControl([], Validators.required);
  name = new FormControl("", [Validators.required]);
  model = new FormControl("", [Validators.required]);
  title = new FormControl("", [Validators.required]);
  description = new FormControl("", [
    Validators.minLength(5), // Minimum 10 characters
    Validators.maxLength(250), // Maximum 100 characters
  ]);
  watch_type = new FormControl("Wrist watch", [Validators.required]);
  year_of_production = new FormControl("", [
    Validators.required, // Ensures the field is required
    Validators.minLength(4), // Minimum length of 4 digits
    Validators.maxLength(4), // Maximum length of 4 digits
    Validators.pattern("^[0-9]{4}$"), // Ensures the value is a 4-digit number
  ]);
  approximation = new FormControl(false);
  unknown = new FormControl(false);
  myControl = new FormControl<string | Brand>("");
  myCategoryControl = new FormControl<string | Category>("");
  filteredCategoryOptions: Observable<Category[]>;
  selectedCategories: FormArray = new FormArray([]);
  MAX_CATEGORY_SELECTION = 5;
  formdropdownListData: any = {};
  brandsList: any;
  categoryList: any;

 // Watch Form Details
  reference_number = new FormControl("", [
    Validators.required, // Field must not be empty
    Validators.pattern("^[a-zA-Z0-9]*$"), // Only alphanumeric characters (letters and numbers)
    Validators.maxLength(30), // Maximum length of 30 characters
  ]);

  decimalPattern = "^[0-9]{1,3}(.[0-9]{1,2})?$";

  serial_no = new FormControl("", [
    Validators.required, // Field must not be empty
    Validators.pattern("^[a-zA-Z0-9]*$"), // Only alphanumeric characters (letters and numbers)
    Validators.maxLength(30),
  ]);
  gender = new FormControl("", Validators.required);
  movement = new FormControl("", Validators.required);

  case_diameter_value_1 = new FormControl(null, [
    Validators.required,
    Validators.pattern(this.decimalPattern),
  ]);
  case_diameter_value_2 = new FormControl(null, [
    Validators.required,
    Validators.pattern(this.decimalPattern),
  ]);
  dial_color = new FormControl("");
  caliber_movement = new FormControl("");
  base_caliber = new FormControl("");
  power_reserve = new FormControl("");
  no_of_jewels = new FormControl(null, [
    Validators.pattern("^[0-9]{1,4}$"), // Ensures only numbers with a maximum of 4 digits
  ]);
  frequency = new FormControl("", [
    Validators.pattern(this.decimalPattern), // Ensures only numbers with a maximum of 4 digits
  ]);
  additional_details = new FormControl("");

  case_material = new FormControl("");
  bezel_material = new FormControl("");
  thickness = new FormControl(null, [Validators.pattern(this.decimalPattern)]);
  crystal = new FormControl("");
  water_resistance = new FormControl("");

  dial_numerals = new FormControl("", [
    Validators.pattern(this.decimalPattern),
  ]);
  bracelet_material = new FormControl("");
  bracelet_color = new FormControl("");
  type_of_clasp = new FormControl("", [
    Validators.pattern(this.decimalPattern),
  ]);
  clasp_material = new FormControl("");
  watchDetailsForm: FormGroup;
  panelStrapOpenState = false;
  panelOpenState = false;
  panelDialOpenState = false;

   // Billing Information Form Details
   billing_address = new FormControl("", [Validators.required]);
   first_name = new FormControl("", [Validators.required]);
   last_name = new FormControl("", [Validators.required]);
   street = new FormControl("", [
     Validators.required, // Ensures the field is not empty
     Validators.pattern("^[a-zA-Z0-9 ]*$"), // Allows only alphanumeric characters and spaces (A-Z, a-z, 0-9, space)
     Validators.maxLength(80), // Limits the input to 30 characters
   ]);
 
   street_line_2 = new FormControl("", [
     Validators.pattern("^[a-zA-Z0-9 ]*$"), // Allows only alphanumeric characters and spaces (A-Z, a-z, 0-9, space)
     Validators.maxLength(80), // Limits the input to 30 characters
   ]);
   zip_code = new FormControl("", [
     Validators.required, // Ensures the field is not empty
     Validators.pattern("^[0-9]*$"), // Ensures only numeric values (digits)
     Validators.maxLength(10),
   ]);
   city = new FormControl("", [Validators.required]);


  constructor(
    public translateService: TranslateService,
    private languageService: LanguageService,
    private loginStateService: LoginStateService,
    private http: HttpService,
    private alertService: AlertsServicesService,
    private router: Router
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  filteredOptions: Observable<Brand[]>;
  async getAllBrandsDropDown() {
    try {
      // Wait for the API response
      const res = await this.http.getAllBrandsDropdDown().toPromise();
      this.brandsList = res.data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          // Determine the name (either the string or the value's name property)
          const name = typeof value === "string" ? value : value?.name;
          // Return the filtered results or the full brandsList if no name
          return name
            ? this._filter(name as string)
            : this.brandsList
            ? this.brandsList.slice()
            : [];
        })
      );

      // Log the brands list
    } catch (error) {
      // Log error if something goes wrong with the API request
      console.error("Error fetching brands:", error);
    }
  }

  private _filter(name: string): Brand[] {
    const filterValue = name.toLowerCase();

    return this.brandsList?.filter((option) =>
      option?.name?.toLowerCase().includes(filterValue)
    );
  }

  async getCategoriesDropDown() {
    try {
      // Await the promise returned by the HTTP request
      const res = await this.http.getCategoryDropDown().toPromise();

      // Extract data from the response
      this.categoryList = res.data;

      // Set up filtered options for category input
      this.filteredCategoryOptions = this.myCategoryControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          const name = typeof value === "string" ? value : value?.name;
          return name ? this._filterCategories(name) : this.categoryList;
        })
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  displayFn(user: Brand): string {
    return user.name;
  }

  displayCategoryFn(category: Category): string {
    return category ? category.name : "";
  }

  addCategory(category: Category): void {
    if (
      this.selectedCategories.controls.length >= this.MAX_CATEGORY_SELECTION
    ) {
      this.myCategoryControl.setValue("");
      this.filteredCategoryOptions = this.myCategoryControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filterCategories(name as string)
            : this.categoryList;
        })
      );
      return; // Do not add more than MAX_CATEGORY_SELECTION
    }

    if (
      this.selectedCategories.controls.some(
        (ctrl) => ctrl.value.id === category.id
      )
    ) {
      this.myCategoryControl.setValue("");
      this.filteredCategoryOptions = this.myCategoryControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filterCategories(name as string)
            : this.categoryList;
        })
      );
      return; // If already selected, do not add again
    }

    this.selectedCategories.push(new FormControl(category));
    this.myCategoryControl.setValue("");
    this.filteredCategoryOptions = this.myCategoryControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name
          ? this._filterCategories(name as string)
          : this.categoryList;
      })
    );
  }

  removeCategory(category: Category): void {
    const index = this.selectedCategories.controls.findIndex(
      (ctrl) => ctrl.value.id === category.id
    );
    if (index !== -1) {
      this.selectedCategories.removeAt(index);
    }
  }

  @ViewChild("videoInput") videoInput!: ElementRef<HTMLInputElement>;
  selectedVideo: File | null = null;
  videoUrl: string | null = null; 
  @ViewChild("otherImagesInput")
  otherImagesInput!: ElementRef<HTMLInputElement>;
  otherImages: ImageFile[] = [];

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

  selectOtherImages() {
    this.otherImagesInput.nativeElement.click();
  }

  selectVideoFile() {
    this.videoInput.nativeElement.click();
  }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.selectedVideo = file;
      this.videoUrl = URL.createObjectURL(file);  // Create a URL for video preview
    } else {
      alert('Please select a valid video file');
      this.videoUrl = null; // Clear the video URL if invalid file
    }
  }

  removeVideo(){
    this.selectedVideo = null;
    this.videoUrl = null;
  }

  uploadVideo(): void {
    if (!this.selectedVideo) {
      alert('Please select a video file first');
      return;
    }
    const formData = new FormData();
    formData.append('video', this.selectedVideo, this.selectedVideo.name);
  }

  coverImage: { file: File; url: string } | null = null;
  isCoverImageUploading = false;

  removeCoverImage() {
    this.coverImage = null;
    this.isCoverImageUploading = false; // Reset uploading state
  }

  onCoverImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const allowedExtensions = ["jpeg", "png", "jpg", "gif", "svg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.alertService.showAlert(
          "warning",
          "Invalid file type. Please select an image with one of the following extensions: jpeg, png, jpg, gif, svg."
        );
        return;
      }

      this.isCoverImageUploading = true;

      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.coverImage = { file, url: reader.result as string };
          this.isCoverImageUploading = false;
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  }


@ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;

  selectCoverImage() {
    this.coverImageInput.nativeElement.click();
  }

  billingInformationDetails: any;

  getBillingInformation() {
    // let userID: any = localStorage.getItem("userID");
    this.http.getBillingInformation().subscribe((res) => {
      // billingForm
      this.billingInformationDetails = res?.data;
      this.billingForm
        .get("billing_address")
        .setValue(this.billingInformationDetails.billing_address || "");

      this.billingForm
        .get("first_name")
        .setValue(this.billingInformationDetails.first_name || "");

      this.billingForm
        .get("last_name")
        .setValue(this.billingInformationDetails.last_name || "");

      this.billingForm
        .get("street")
        .setValue(this.billingInformationDetails.street || "");
      this.billingForm
        .get("street_line_2")
        .setValue(this.billingInformationDetails.street_line_2 || "");

      this.billingForm
        .get("zip_code")
        .setValue(this.billingInformationDetails.zip_code || "");

      this.billingForm
        .get("city")
        .setValue(this.billingInformationDetails.city || "");
    });
  }


  ngOnInit(): void {
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

    this.getAllBrandsDropDown();
    this.getCategoriesDropDown();
    this.allDropDownData();
    this.getBillingInformation()

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.brandsList
          ? this.brandsList.slice()
          : [];
      })
    );
    this.filteredCategoryOptions = this.myCategoryControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name
          ? this._filterCategories(name as string)
          : this.categoryList;
      })
    );

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
  }

  private _filterCategories(name: string): Category[] {
    const filterValue = name.toLowerCase();
    let val = this.categoryList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );

    return val;
  }

  allDropDownData() {
    this.http.getallDropDownformData().subscribe((res) => {
      this.formdropdownListData = res.data;
      this.formdropdownListData.watch_type = Object.entries(
        res.data.watch_type
      ).map(([key, value]) => ({ key, value }));
      console.log("formdropdownListData", this.formdropdownListData);
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

  selectedCondition = null;

  selectCondition(condition: any) {
    this.selectedCondition = condition;
  }

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
    if(this.shipping_charges){
      this.estimatedPayoutwithShipping = this.estimatedPayout - this.shipping_charges
    }
  }

  Payoutaftershippingcharges() {
    this.estimatedPayoutwithShipping = this.estimatedPayout - this.shipping_charges;
  }

  countShipping(){
    // console.log("Onshiping Charges Change is call")
    // console.log("this.shipping_type",this.shipping_type)
    // console.log("this.shipping_charges",this.shipping_charges)
    if(this.shipping_type == 'inclusiveShipping'){
      console.log("this.shipping_type is inclusiveShipping ")
      if(this.shipping_charges){
        console.log("this.shipping_charges",this.shipping_charges)
        console.log("this.estimatedPayoutwithShipping bwfore",this.estimatedPayoutwithShipping)
        this.estimatedPayoutwithShipping = Number(this.estimatedPayout) - Number(this.shipping_charges);
        console.log("this.estimatedPayoutwithShipping after",this.estimatedPayoutwithShipping)
      }
    }else{
      if(this.shipping_charges){
        console.log("this.estimatedPayoutwithShipping bwfore",this.estimatedPayoutwithShipping)
        this.estimatedPayoutwithShipping = Number(this.estimatedPayout);
        console.log("this.estimatedPayoutwithShipping after",this.estimatedPayoutwithShipping)
      }
    }
  }

  billingForm: FormGroup;

  onSubmit(Param: string) {
    if (Param == "listingDetails") {
      if (this.myControl.value) {
        this.listingForm
          .get("brand_id")
          .setValue(
            this.myControl.value && typeof this.myControl.value !== "string"
              ? this.myControl.value.id
              : null
          );
      }
      if (this.selectedCategories.value.length > 0) {
        this.listingForm
          .get("category_ids")
          .setValue(
            this.selectedCategories.value.map((category) => category.id)
          );
      }
      this.listingForm.markAllAsTouched();
      if (this.listingForm.valid) {
        console.log("this.listingForm.value", this.listingForm.value);
      } else {
        const firstInvalidControl = Object.keys(this.listingForm.controls).find(
          (key) => {
            const control = this.listingForm.get(key);
            return control && control.invalid;
          }
        );

        if (firstInvalidControl) {
          const control = this.listingForm.get(firstInvalidControl);

          if (firstInvalidControl == "brand_id") {
            this.alertService.showAlert("warning", `Please select a brand.`);
          } else if (firstInvalidControl == "category_ids") {
            this.alertService.showAlert("warning", `Please select a category.`);
          } else {
            this.alertService.showAlert(
              "warning",
              `${firstInvalidControl}" is invalid.`
            );
          }
        } else {
          // console.log("Form is valid, proceed with submission.");
          this.alertService.showAlert("warning", "Enter Form Values");
        }
      }
    }else if(Param == "watchDetails"){
      if(this.watchDetailsForm.valid){
        console.log("this.watchDetailsForm.value",this.watchDetailsForm.value)
      }else{
        this.alertService.showAlert('warning','Enter Form Values')
      }
    }else if(Param == "uploadImages"){
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
        formData.append(
          "main_image",
          this.coverImage.file,
          this.coverImage.file.name || "main_image.jpg"
        );
      }

      if (this.selectedVideo) {
        formData.append("video",this.selectedVideo || "main_image.jpg");
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
    }else if(Param == "conditionGrading"){
      console.log("this.selectedCondition.title",this.selectedCondition.title)
    }else if(Param == "scopeofdelivery"){
      console.log("this.selectedOptions.title",this.selectedOptions.title)
    }
    else if(Param == "priceshipment"){
      if (
        this.shipping_type === "inclusiveShipping" &&
        !this.shipping_charges
      ) {
        this.alertService.showAlert("info", "Enter Form Values");
        return;
      } else {
        let isUpdate;
        const formData = {
          price: this.watchPrice,
          shipping_type: this.shipping_type,
          shipping_charges: this.shipping_charges,
          estimate_delivery: this.estimate_delivery,
          allow_to_make_offer: this.allow_to_make_offer,
          estimate_payout: this.estimatedPayoutwithShipping,
          isUpdate: isUpdate,
        };

        console.log("formData",formData)
      }
    }
    else if(Param == "billinginformation"){

      console.log("this.billing info",this.billingForm.value)

    }
  }
}
