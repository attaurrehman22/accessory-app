import {
  Component,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  computed,
} from "@angular/core";
import {noFutureYearValidator } from '../../validator/string.validator'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { NavigationStart, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { MatDialog } from "@angular/material/dialog";
import { LoginComponent } from "../../auth/login/login.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { LanguageService } from "src/services/lang-service/language.service";
import { CanComponentDeactivate } from "src/app/can-deactivate-form.guard";
import { LoginStateService } from "src/services/login-service/login-state.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatCheckboxChange } from "@angular/material/checkbox";

interface ImageFile {
  file: File;
  url: string;
  isUploading: boolean;
  isCover?: boolean;
}

export interface Brand {
  name: string;
  id: any;
}

export interface Category {
  name: string;
  id: any;
}

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})
export class AddNewProductComponent implements OnInit, CanComponentDeactivate {
  apiUrl = environment.apipath + "/";
  nullImagePath = this.apiUrl + "null";
  selectedSection: string = "listingDetails";
  selectedOptionsList: any = ["listingDetails"];
  formDirty = false;
  isSmallScreen: boolean = false;
  panelOpenState = false;
  panelDialOpenState = false;
  panelStrapOpenState = false;
  coverImage: { file: File; url: string } | null = null;
  otherImages: ImageFile[] = [];
  isCoverImageUploading = false;
  productIDFromResponse: any;
  selectedVideo: File | null = null;
  videoUrl: string | null = null;
  isAdminUser = computed(() => this.loginStateService.isAdminUser());
  apipath = environment.apipath;

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      this.selectedVideo = file;
      this.videoUrl = URL.createObjectURL(file); // Create a URL for video preview
    } else {
      alert("Please select a valid video file");
      this.videoUrl = null; // Clear the video URL if invalid file
    }
  }

  deleted_video:boolean=false;
  removeVideo(event: MouseEvent) {
    event.stopPropagation();
    this.deleted_video = true;
    this.selectedVideo = null;
    this.videoUrl = null;
  }

  selectVideoFile() {
    this.videoInput.nativeElement.click();
  }

  uploadVideo(): void {
    if (!this.selectedVideo) {
      alert("Please select a video file first");
      return;
    }
    const formData = new FormData();
    formData.append("video", this.selectedVideo, this.selectedVideo.name);
  }

  @ViewChild("coverImageInput") coverImageInput!: ElementRef<HTMLInputElement>;
  @ViewChild("videoInput") videoInput!: ElementRef<HTMLInputElement>;
  @ViewChild("otherImagesInput")
  otherImagesInput!: ElementRef<HTMLInputElement>;

  listingForm: FormGroup;
  watchDetailsForm: FormGroup;
  billingForm: FormGroup;

  // Listing Form Details

  brand_id = new FormControl(null, Validators.required);
  category_ids = new FormControl([], Validators.required);
  // name = new FormControl("", [Validators.required]);
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
    noFutureYearValidator,
  ]);
  approximate_year = new FormControl(true);
  unknown = new FormControl(false);

  // Watch Form Details

   decimalPattern = "^[0-9]{1,3}(.[0-9]{1,2})?$";
   refPattern = "^[0-9]{1,10}(\\.[0-9]{1,5})?$";

  reference_number = new FormControl("", [
    Validators.pattern(this.refPattern), // Only alphanumeric characters (letters and numbers)
    Validators.maxLength(30), // Maximum length of 30 characters
  ]);

 

  serial_no = new FormControl("", [
    Validators.pattern("^[a-zA-Z0-9]*$"), // Only alphanumeric characters (letters and numbers)
    Validators.maxLength(30),
  ]);
  gender = new FormControl("Unisex");
  movement = new FormControl("");

  case_diameter_value_1 = new FormControl(null, [
    Validators.pattern(this.decimalPattern),
  ]);
  case_diameter_value_2 = new FormControl(null, [
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

  cities = ["City 1", "City 2", "City 3"];
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private http: HttpService,
    private alertService: AlertsServicesService,
    private router: Router,
    private loginStateService: LoginStateService,
    private dialog: MatDialog,
    public translateService: TranslateService,
    private languageService: LanguageService
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

  watchPrice: number = 0;
  shipping_type: any;
  shipping_charges: number = 0;
  // estimate_delivery: any;
  allow_to_make_offer: false;
  watchPriceDisplay: number = 0;

  // configureable User and Dealer Platform Fees
  configureableUserPlatFormFees: number = 0.04;
  configureableDealerPlatFormFees: number = 0.04;

  platformFee: number = 0;
  estimatedPayout: number = 0;
  estimatedPayoutwithShipping: number = 0;
  calculatePayout() {
    this.watchPriceDisplay = this.watchPrice;
    if (this.userType == "dealer") {
      this.platformFee = this.watchPrice * this.configureableUserPlatFormFees;
    } else {
      this.platformFee = this.watchPrice * this.configureableDealerPlatFormFees;
    }
    this.estimatedPayout = this.watchPrice - this.platformFee;
    if (this.shipping_charges) {
      this.estimatedPayoutwithShipping =
        this.estimatedPayout - this.shipping_charges;
    }
  }

  Payoutaftershippingcharges() {
    this.estimatedPayoutwithShipping =
      this.estimatedPayout - this.shipping_charges;
  }

  countShipping() {
    if (this.shipping_type == "inclusiveShipping") {
      if (this.shipping_charges) {
        this.estimatedPayoutwithShipping =
          Number(this.estimatedPayout) - Number(this.shipping_charges);
      }
    } else {
      if (this.shipping_charges) {
        this.estimatedPayoutwithShipping = Number(this.estimatedPayout);
      }
    }
  }

  clocks: { hour: number; minute: number }[] = [];

  generateRandomClocks(count: number) {
    this.clocks = Array.from({ length: count }, () => {
      const hour = Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      return { hour, minute };
    });
  }

  getClockRotations(timeText: string) {
    const [hour, minute] = timeText.split(":").map(Number); // Convert to number

    const hourRotation = hour * 30 + minute * 0.5; // Calculate hour hand rotation
    const minuteRotation = minute * 6; // Calculate minute hand rotation

    return { hourRotation, minuteRotation };
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
      arabictitle: "الصندوق الأصلي والأوراق الأصلية",
    },
    {
      title: "Original Box",
      icon: "../assets/images/original-box.png",
      arabictitle: "الصندوق الأصلي",
    },
    {
      title: "Original Papers",
      icon: "/assets/images/original-papers.png",
      arabictitle: "الأوراق الأصلية",
    },
    {
      title: "Watch Only",
      icon: "/assets/images/watch-only.png",
      arabictitle: "الساعة فقط",
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

  dealerconditions = [
    {
      title: "New",
      description:
        "The item has no signs of wear such as scratches or dents and is unworn. The item has not been polished.",
      arabictitle: "جديد",
      arabicdescription:
        "العنصر ليس به أي علامات تآكل مثل الخدوش أو الانبعاجات ولم يُستخدم. لم يتم تلميع العنصر.",
    },
    {
      title: "Like new and unworn",
      description:
        "The item shows minor signs of wear, such as small but physically imperceptible scratches.",
      arabictitle: "كالجديد وغير مُستخدم",
      arabicdescription:
        "يظهر العنصر علامات تآكل طفيفة، مثل خدوش صغيرة لكنها غير محسوسة جسديًا.",
    },
    {
      title: "Used",
      description:
        "The item shows visible and physically perceptible signs of wear such as scratches, scuffs or small dents.",
      arabictitle: "مُستخدم",
      arabicdescription:
        "يظهر العنصر علامات تآكل مرئية ومحسوسة جسديًا مثل الخدوش أو الحكات أو الانبعاجات الصغيرة.",
    },
    {
      title: "Very good (minor signs of wear)",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
      arabictitle: "جيد جدًا (علامات تآكل طفيفة)",
      arabicdescription:
        "يظهر العنصر علامات تآكل كبيرة ومرئية مثل الخدوش والانبعاجات.",
    },
    {
      title: "Good (moderate signs of wear)",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
      arabictitle: "جيد (علامات تآكل متوسطة)",
      arabicdescription:
        "يظهر العنصر علامات تآكل كبيرة ومرئية مثل الخدوش والانبعاجات.",
    },
    {
      title: "Incomplete",
      description: "The item is missing some parts and is not functional.",
      arabictitle: "غير مكتمل",
      arabicdescription: "العنصر يفتقد بعض الأجزاء وغير قابل للاستخدام.",
    },
  ];

  conditions = [
    {
      title: "Like New & Unworn",
      description:
        "The item has no signs of wear such as scraches or dents and is unworn. The item has not been polished.",
      arabictitle: "كالجديد وغير مُستخدم",
      arabicdescription:
        "العنصر ليس به أي علامات تآكل مثل الخدوش أو الانبعاجات ولم يُستخدم. لم يتم تلميع العنصر.",
    },
    {
      title: "Very Good",
      description:
        "The item shows minor signs of wear, such as small but physically imperceptible scratches.",
      arabictitle: "جيد جدًا",
      arabicdescription:
        "يظهر العنصر علامات تآكل طفيفة، مثل خدوش صغيرة لكنها غير محسوسة جسديًا.",
    },
    {
      title: "Good",
      description:
        "The item shows visible and physically perceptible signs of wear such as scratches, scuffs or small dents.",
      arabictitle: "جيد",
      arabicdescription:
        "يظهر العنصر علامات تآكل مرئية ومحسوسة جسديًا مثل الخدوش أو الحكات أو الانبعاجات الصغيرة.",
    },
    {
      title: "Fair",
      description:
        "The item shows major, visible signs of wear like scratches and dents.",
      arabictitle: "مقبول",
      arabicdescription:
        "يظهر العنصر علامات تآكل كبيرة ومرئية مثل الخدوش والانبعاجات.",
    },
    {
      title: "Incomplete",
      description: "The item is missing some parts and is not functional.",
      arabictitle: "غير مكتمل",
      arabicdescription: "العنصر يفتقد بعض الأجزاء وغير قابل للاستخدام.",
    },
  ];

  allImages: any[] = [];
  // coverImage: any = null;

  @ViewChild("imagesInput") imagesInput!: ElementRef<HTMLInputElement>;

  selectImages() {
    this.imagesInput.nativeElement.click();
  }

 onImagesSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        const newImage: ImageFile = { file, url: "", isUploading: true };

        this.allImages.push(newImage);

        reader.onload = () => {
          newImage.url = reader.result as string;
          newImage.isUploading = false;

          // If no cover image is selected, set the first image as cover
          const hasCover = this.allImages.some((img) => img.isCover);
          if (!hasCover) {
            this.setAsCoverImage(newImage);
          }
        };

        reader.readAsDataURL(file);
      });
    }
  }

  setAsCoverImage(image: ImageFile) {
    this.allImages.forEach((img) => {
      img.isCover = img.url === image.url;
    });

    const cover = this.allImages.find((img) => img.url === image.url);
    if (cover) {
      this.coverImage = cover;
      this.allImages = [cover, ...this.allImages.filter((img) => img.url !== image.url)];
    }
  }

  removedImagesUrl: string[] = [];

  removeImage(image: ImageFile) {
    this.removedImagesUrl.push(image.url)
    const wasCover = image.isCover;
    this.allImages = this.allImages.filter((img) => img.url !== image.url);

    if (wasCover && this.allImages.length > 0) {
      this.setAsCoverImage(this.allImages[0]);
    }
  }

  onImageDrop(event: CdkDragDrop<ImageFile[]>) {
    moveItemInArray(this.allImages, event.previousIndex, event.currentIndex);

    // Recalculate cover image
    this.allImages.forEach((img, index) => {
      img.isCover = index === 0;
    });

    this.coverImage = this.allImages[0];
  }


  selectedCondition = null;

  selectCondition(condition: any) {
    this.selectedCondition = condition;
  }

  brandsList: any;

  myControl = new FormControl<string | Brand>("");
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

  displayFn(user: Brand): string {
    return user.name;
  }

  private _filter(name: string): Brand[] {
    const filterValue = name.toLowerCase();

    return this.brandsList?.filter((option) =>
      option?.name?.toLowerCase().includes(filterValue)
    );
  }

  categoryList: any;
  myCategoryControl = new FormControl<string | Category>("");
  selectedCategories: FormArray = new FormArray([]);
  filteredCategoryOptions: Observable<Category[]>;
  MAX_CATEGORY_SELECTION = 5;
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
    // this.myCategoryControl = new FormControl<string | Category>("");
    // this.filteredCategoryOptions=this.categoryList;
    this.myCategoryControl.setValue("");
    // this.filteredCategoryOptions = this.myCategoryControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterCategories(value)) // Reapply the filter
    // );
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

  // Remove selected category from the FormArray
  removeCategory(category: Category): void {
    const index = this.selectedCategories.controls.findIndex(
      (ctrl) => ctrl.value.id === category.id
    );
    if (index !== -1) {
      this.selectedCategories.removeAt(index);
    }
  }

  // Filtering categories
  private _filterCategories(name: string): Category[] {
    const filterValue = name.toLowerCase();
    let val = this.categoryList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );

    return val;
  }

  formdropdownListData: any = {};

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
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log("Modal closed with result:", result);

      if (result == true) {
        // Do something when user confirms action

      } else if (!result) {
        // Do something else or skip action
        console.log("User closed the modal or undefined the action");
        this.router.navigateByUrl("/login");
      } else if (result == 'register') {
        // Do something else or skip action
        console.log("User closed the modal or register the action");
        this.router.navigateByUrl("/register");
      }
      else if (result == false) {
        // Do something else or skip action
        console.log("User closed the modal or canceled the action");
        this.router.navigateByUrl("/login");
      }
    });
  }

  isProductID: any;
  userType: any;
  isFromMyListingComponent: boolean = false;
  isAdminLogin: boolean = false;

  productDetails: any;
  latestActiveForm: string = "";
  isNextButtonShowonBillingInformation: boolean = false;
  isNextButtonShowonProofofOwnerShip: boolean = false;
  isNextButtonShowonScopeOfdelivery: boolean = false;

  nextMoveToSummary() {
    this.selectSection("summary");
  }

  nextMoveToBillingInformation() {
    this.selectSection("priceshipment");
  }

  nextMoveToScopeOfDelivery() {
    this.selectSection("scopeofdelivery");
  }

  isListingCompleted: boolean = false;
  isPublishedProduct: Boolean = false;
  currentStepper: any = "";

  getOnlyDetails() {
    this.http
      .getProductDetailsByID(this.productIDFromResponse)
      .subscribe((res) => {
        this.currentStepper = res.step;
        this.productDetails = res.product;
        if (res?.product?.published_date) {
          this.isPublishedProduct = true;
        }
        this.latestActiveForm = res.step;
        if (res.is_listing_completed === 1) {
          this.isListingCompleted = true;
        }
        if (this.productDetails?.main_image) {
          this.productDetails.main_image =
            this.productDetails?.main_image.replace(/\\/g, "");
        }

        if (this.productDetails?.video) {
          this.productDetails.video = this.productDetails.video.replace(
            /\\/g,
            ""
          );
        }

        if (this.productDetails?.additional_images) {
          try {
            this.productDetails.additional_images = JSON.parse(
              this.productDetails?.additional_images
            ).map((image) => image.replace(/\\/g, ""));
          } catch (e) {
            console.error("Failed to parse additional_images", e);
          }
        }

        if (this.productDetails?.proof_image_1) {
          this.productDetails.proof_image_1 =
            this.productDetails?.proof_image_1.replace(/\\/g, "");
        }

        if (this.productDetails?.proof_image_2) {
          this.productDetails.proof_image_2 =
            this.productDetails?.proof_image_2.replace(/\\/g, "");
        }
      });
    this.patchFormDetails();
  }

  getProductDetails() {
    this.http
      .getProductDetailsByID(this.productIDFromResponse)
      .subscribe((res) => {
        this.productDetails = res.product;
        this.latestActiveForm = res.step;
        if (res.is_listing_completed === 1) {
          this.isListingCompleted = true;
        }
        if (this.productDetails.main_image) {
          this.productDetails.main_image =
            this.productDetails.main_image.replace(/\\/g, "");
        }

        if (this.productDetails?.video) {
          this.productDetails.video = this.productDetails.video.replace(
            /\\/g,
            ""
          );
        }

        if (this.productDetails.additional_images) {
          try {
            this.productDetails.additional_images = JSON.parse(
              this.productDetails.additional_images
            ).map((image) => image.replace(/\\/g, ""));
          } catch (e) {
            console.error("Failed to parse additional_images", e);
          }
        }

        if (this.productDetails.proof_image_1) {
          this.productDetails.proof_image_1 =
            this.productDetails.proof_image_1.replace(/\\/g, "");
        }

        if (this.productDetails.proof_image_2) {
          this.productDetails.proof_image_2 =
            this.productDetails.proof_image_2.replace(/\\/g, "");
        }

        if (
          this.latestActiveForm === "completed" ||
          this.latestActiveForm === "publishListing" ||
          this.isListingCompleted
        ) {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
            "conditionGrading",
            "scopeofdelivery",
            "proofofownership",
            "priceshipment",
            "billinginformation",
            "summary",
          ]);
          this.isNextButtonShowonBillingInformation = true;
          this.isNextButtonShowonProofofOwnerShip = true;
          this.isNextButtonShowonScopeOfdelivery = true;
          this.selectSection("summary");
        }
        if (this.latestActiveForm === "billingInformation") {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
            "conditionGrading",
            "scopeofdelivery",
            "proofofownership",
            "priceshipment",
            "billinginformation",
          ]);
          this.isNextButtonShowonProofofOwnerShip = true;
          this.isNextButtonShowonScopeOfdelivery = true;
          this.selectSection("billinginformation");
        }

        if (this.latestActiveForm === "priceAndShipment") {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
            "conditionGrading",
            "scopeofdelivery",
            "proofofownership",
            "priceshipment",
          ]);
          this.isNextButtonShowonProofofOwnerShip = true;
          this.isNextButtonShowonScopeOfdelivery = true;
          this.selectSection("priceshipment");
        }
        if (this.latestActiveForm === "proofOfOwnership") {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
            "conditionGrading",
            "scopeofdelivery",
            "proofofownership",
          ]);
          this.isNextButtonShowonScopeOfdelivery = true;
          this.selectSection("proofofownership");
        }

        if (this.latestActiveForm === "scopeOfDelivery") {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
            "conditionGrading",
            "scopeofdelivery",
          ]);
          // this.isNextButtonShowonScopeOfdelivery = true;
          this.selectSection("scopeofdelivery");
        }

        if (
          this.latestActiveForm === "conditionGrading" &&
          !this.isListingCompleted
        ) {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
            "conditionGrading",
          ]);
          this.selectSection("conditionGrading");
        }

        if (this.latestActiveForm === "uploadImages") {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
            "uploadImages",
          ]);
          this.selectSection("uploadImages");
        }

        if (this.latestActiveForm === "listingDetails") {
          this.selectedOptionsList = this.selectedOptionsList.concat([
            "watchDetails",
          ]);
          this.selectSection("watchDetails");
        }

        this.patchFormDetails();
      });
  }

  patchFormDetails() {
    if (this.productDetails) {
      // listingForm
      const selectedBrand = this.productDetails.brand;
      // Patch the brand value into the form control
      if (selectedBrand) {
        this.myControl.setValue(selectedBrand); // Set the full brand object
      }

      // Disable the brand input field if brand_id exists
      if (this.productDetails.brand_id) {
        this.listingForm.get("brand_id").disable();
      }

      let ids = this.productDetails.categories.map((item: any) => item.id);
      this.productDetails.categories.map((item: any) => this.addCategory(item));
      // this.filteredCategoryOptions=this.productDetails.categories
      this.listingForm.get("category_ids").setValue(ids);
      if (ids.length > 0) {
        this.listingForm.get("category_ids").disable();
      }

      // this.listingForm.get("name").setValue(this.productDetails.name);
      // if (this.productDetails.name) {
      // }

      this.listingForm.get("model").setValue(this.productDetails.model);
      if (this.productDetails.model) {
        // this.listingForm.get("model").disable();
      }

      this.listingForm.get("title").setValue(this.productDetails.title);
      if (this.productDetails.title) {
        // this.listingForm.get("title").disable();
      }
      this.listingForm
        .get("description")
        .setValue(this.productDetails.description);
      this.listingForm
        .get("watch_type")
        .setValue(this.productDetails.watch_type);
      if (this.productDetails.watch_type) {
        // this.listingForm.get("watch_type").disable();
      }

      // Additional fields with checks
      this.listingForm
        .get("year_of_production")
        .setValue(this.productDetails.year_of_production);
      if (this.productDetails.year_of_production) {
        // this.listingForm.get("year_of_production").disable();
      }

      // this.listingForm.get("approximate_year").setValue(this.productDetails.approximate_year);
      this.listingForm.get("approximate_year")?.setValue(this.productDetails.approximate_year === 1);
      // if (this.productDetails.approximate_year == 1 ) {
      //   this.listingForm.get("year_of_production").enable();
      //   this.listingForm.get("year_of_production").setValidators([
      //     Validators.required,
      //     Validators.minLength(4),
      //     Validators.maxLength(4),
      //     Validators.pattern("^[0-9]{4}$")
      //   ]);
      //   this.listingForm.get("year_of_production").updateValueAndValidity();
      //   this.listingForm.get("unknown").disable();
      //   // this.listingForm.get("approximate_year").disable();
      // }

      this.listingForm.get("unknown")?.setValue(this.productDetails.unknown === 1);

      if(this.productDetails?.unknown == 1){
        this.listingForm.get("year_of_production").disable();
        this.listingForm.get("year_of_production").clearValidators();
        this.listingForm.get("year_of_production").updateValueAndValidity();
        this.listingForm.get("unknown").disable();
        this.listingForm.get("approximate_year").disable();
      }

      if(this.productDetails?.approximate_year == 1){
        this.listingForm.get("year_of_production").disable();
        this.listingForm.get("unknown").disable();
        this.listingForm.get("approximate_year").disable();
      }

      // if(this.productDetails.unknown === 1){
      //   this.listingForm.get("year_of_production").disable();
      //   this.listingForm.get("year_of_production").clearValidators();
      //   this.listingForm.get("year_of_production").updateValueAndValidity();
      // }

      // watchDetailsForm
      this.watchDetailsForm
        .get("reference_number")
        .setValue(this.productDetails.reference_number);

      if (this.productDetails.reference_number) {
        // this.watchDetailsForm.get("reference_number").disable();
      }

      this.watchDetailsForm
        .get("serial_no")
        .setValue(this.productDetails.serial_no);

      if (this.productDetails.serial_no) {
        // this.watchDetailsForm.get("serial_no").disable();
      }

      if(this.productDetails.gender){
        this.watchDetailsForm.get("gender").setValue(this.productDetails.gender);
      }

      this.watchDetailsForm
        .get("movement")
        .setValue(this.productDetails.movement);
      this.watchDetailsForm
        .get("case_diameter_value_1")
        .setValue(this.productDetails.case_diameter_value_1);
      this.watchDetailsForm
        .get("case_diameter_value_2")
        .setValue(this.productDetails.case_diameter_value_2);
      this.watchDetailsForm
        .get("dial_color")
        .setValue(this.productDetails.dial_color);
      this.watchDetailsForm
        .get("caliber_movement")
        .setValue(this.productDetails.caliber_movement);
      this.watchDetailsForm
        .get("base_caliber")
        .setValue(this.productDetails.base_caliber);
      this.watchDetailsForm
        .get("power_reserve")
        .setValue(this.productDetails.power_reserve);
      this.watchDetailsForm
        .get("no_of_jewels")
        .setValue(this.productDetails.no_of_jewels);
      this.watchDetailsForm
        .get("frequency")
        .setValue(this.productDetails.frequency);
      this.watchDetailsForm
        .get("additional_details")
        .setValue(this.productDetails.additional_details);
      this.watchDetailsForm
        .get("case_material")
        .setValue(this.productDetails.case_material);
      this.watchDetailsForm
        .get("bezel_material")
        .setValue(this.productDetails.bezel_material);
      this.watchDetailsForm
        .get("thickness")
        .setValue(this.productDetails.thickness);
      this.watchDetailsForm
        .get("crystal")
        .setValue(this.productDetails.crystal);
      this.watchDetailsForm
        .get("water_resistance")
        .setValue(this.productDetails.water_resistance);
      this.watchDetailsForm
        .get("dial_numerals")
        .setValue(this.productDetails.dial_numerals);
      this.watchDetailsForm
        .get("bracelet_material")
        .setValue(this.productDetails.bracelet_material);
      this.watchDetailsForm
        .get("bracelet_color")
        .setValue(this.productDetails.bracelet_color);
      this.watchDetailsForm
        .get("type_of_clasp")
        .setValue(this.productDetails.type_of_clasp);
      this.watchDetailsForm
        .get("clasp_material")
        .setValue(this.productDetails.clasp_material);

      // billingForm

      let citval = this.billingForm.get("city")?.value;
      if (!citval) {
        this.billingForm.get("city").setValue(this.productDetails.city || "");
      }

      if (this.billingForm.get("billing_address")?.value) {
      } else {
        this.billingForm
          .get("billing_address")
          .setValue(this.productDetails.billing_address || "");
      }

      if (this.billingForm.get("first_name")?.value) {
      } else {
        this.billingForm
          .get("first_name")
          .setValue(this.productDetails.first_name || "");
      }

      if (this.billingForm.get("last_name")?.value) {
      } else {
        this.billingForm
          .get("last_name")
          .setValue(this.productDetails.last_name || "");
      }

      if (this.billingForm.get("street")?.value) {
      } else {
        this.billingForm
          .get("street")
          .setValue(this.productDetails.street || "");
      }

      if (this.billingForm.get("street_line_2")?.value) {
      } else {
        this.billingForm
          .get("street_line_2")
          .setValue(this.productDetails.street_line_2 || "");
      }

      if (this.billingForm.get("zip_code")?.value) {
      } else {
        this.billingForm
          .get("zip_code")
          .setValue(this.productDetails.zip_code || "");
      }

      // PriceandShipment
      this.watchPrice = this.productDetails.price;
      this.shipping_type = this.productDetails.shipping_type;
      this.shipping_charges = this.productDetails.shipping_charges;
      // this.estimate_delivery = this.productDetails.estimate_delivery;
      this.allow_to_make_offer = this.productDetails.allow_to_make_offer;
      this.estimatedPayoutwithShipping = this.productDetails.estimate_payout;

      // If the form has a method to calculate payout
      this.calculatePayout();

      // Condition
      if (this.productDetails?.condition) {
        let selectedCondition;
        if (this.userType == "dealer" || this.userType == "admin") {
          selectedCondition = this.dealerconditions.find(
            (condition) => condition.title == this.productDetails.condition
          );
          this.dealerconditions = [selectedCondition];
        } else {
          selectedCondition = this.conditions.find(
            (condition) => condition.title == this.productDetails.condition
          );
          // selectedCondition=this.conditions.filter((item:any)=>{item.title === this.productDetails.condition})
          this.conditions = [selectedCondition];
        }
        this.selectCondition(selectedCondition);
      }

      //scopeofDelivery
      const scopeofDelivery = this.options.find(
        (option) => option.title === this.productDetails.scope_of_delivery
      );

      this.selectedOptions = scopeofDelivery;

      if (this.productDetails?.video) {
        this.videoUrl = this.apiUrl + this.productDetails.video;
      }
      if(this.productDetails?.main_image){
        this.coverImage = {
          file: null,
          url: this.apiUrl + this.productDetails.main_image,
        };
      }
      if (this.productDetails?.additional_images) {
        this.otherImages = this.productDetails.additional_images.map(
          (img: { url: string }) => ({
            file: null,
            url: this.apiUrl + img,
            isUploading: false,
          })
        );
      }

      console.log("otherImages in Patch Form ",this.otherImages)
      console.log("coverImage in Patch Form ",this.coverImage)
      if (this.otherImages.length > 0 || this.coverImage) {

        this.allImages = this.otherImages;
        this.allImages = [this.coverImage, ...this.allImages];
        this.allImages = this.allImages.map((img, index) => ({
          ...img,
          isCover: index === 0
        }));

        console.log("ALL Images in Patch Form ",this.allImages)
      }
      if (this.productDetails?.proof_image_1) {
        this.isEnableProofofOwnerShip = true;
        this.imagePreviews[0] = this.apiUrl + this.productDetails.proof_image_1;
      }
      if (this.productDetails?.proof_image_2) {
        this.isEnableProofofOwnerShip = true;
        this.imagePreviews[1] = this.apiUrl + this.productDetails.proof_image_2;
      }
    }
  }

  getBillingInformation() {
    let userID: any = localStorage.getItem("userID");
    let userTokken: any = localStorage.getItem("user_token");
    if (userTokken) {
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
  }

onApproximateYearChange(event: MatCheckboxChange): void {
  const unknownCtrl = this.listingForm.get('unknown');
  const yearCtrl = this.listingForm.get('year_of_production');

  if (event.checked) {
    unknownCtrl?.setValue(false);
    // unknownCtrl?.disable();

    // Enable and add validators
    yearCtrl?.enable();
    yearCtrl?.setValidators([
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern("^[0-9]{4}$")
    ]);
    yearCtrl?.updateValueAndValidity();
  } else {
    // unknownCtrl?.enable();
  }
}


onUnknownChange(event: MatCheckboxChange): void {
  const approxCtrl = this.listingForm.get('approximate_year');
  const yearCtrl = this.listingForm.get('year_of_production');

  if (event.checked) {
    approxCtrl?.setValue(false);
    // approxCtrl?.disable();

    // Disable and remove validators
    yearCtrl?.disable();
    yearCtrl?.clearValidators();
    yearCtrl?.updateValueAndValidity();
  } else {
    // approxCtrl?.enable();
  }
}




  isEnableProofofOwnerShip: boolean = false;
  billingInformationDetails: any;
  ngOnInit() {
    let isUserLogin = localStorage.getItem("isLoggedIn");
    let userToken = localStorage.getItem("user_token");
    this.userType = localStorage.getItem("userType");
    if (!userToken) {
      this.loginFirst();
    }
    if (!this.productIDFromResponse) {
      this.productIDFromResponse = localStorage.getItem("productID");
      const selectedOptionsListString = localStorage.getItem(
        "selectedOptionsList"
      );

      if (selectedOptionsListString) {
        const selectedOptionsList = selectedOptionsListString;
        // Assign the last element of the list to selectedSection
        if (selectedOptionsList.length > 0) {
          this.selectedSection =
            selectedOptionsList[selectedOptionsList.length - 1];
        }
      }
    }

    let userID: any = localStorage.getItem("userID");
    // if (userID) {
    this.getBillingInformation();
    // }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        localStorage.removeItem("productID");
        localStorage.removeItem("selectedOptionsList");
      }
    });

    if (this.isAdminUser() == true) {
      this.isAdminLogin = true;
    }

    if (history?.state) {
      if (history?.state?.ID) {
        this.productIDFromResponse = history.state.ID;
        this.selectedSection = "summary";
        this.calculatePayout();
        this.formDirty = true;
      }
      if (history?.state?.productID) {
        this.productIDFromResponse = history?.state?.productID;
        this.isFromMyListingComponent = true;
        this.getProductDetails();
      }
    }

    if (this.productIDFromResponse) {
      this.isFromMyListingComponent = true;
      this.getProductDetails();
    }

    this.checkScreenSize();
    this.getAllBrandsDropDown();
    this.getCategoriesDropDown();
    this.allDropDownData();
    window.addEventListener("resize", () => this.checkScreenSize());
    this.generateRandomClocks(2);
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

    // Listing Form
    this.listingForm = new FormGroup({
      brand_id: this.brand_id,
      category_ids: this.category_ids,
      // name: this.name,
      model: this.model,
      title: this.title,
      description: this.description,
      watch_type: this.watch_type,
      year_of_production: this.year_of_production,
      approximate_year: this.approximate_year,
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
  }

  selectedUserTypeofConditionGradingForAdmin: any;

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  selectSection(section: string) {
    this.getOnlyDetails();
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
      const allowedExtensions = ["jpeg", "png", "jpg", "gif", "svg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Invalid file type. Please select an image with one of the following extensions: jpeg, png, jpg, gif, svg."
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "نوع الملف غير صالح. يرجى اختيار صورة بإحدى الصيغ التالية: jpeg، png، jpg، gif، svg."
          );
        }
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

  // removeImage(image: { url: string; isUploading: boolean }) {
  //   this.otherImages = this.otherImages.filter((img) => img !== image);
  // }

  brandnametoDisplay: any;

  matchBrandname() {
    let SelectedbrandID;
    if (this.productDetails) {
      SelectedbrandID = this.productDetails.brand.id;
    } else {
      SelectedbrandID = this.listingForm.get("brand_id").value();
    }
    // console.log("this listingForm getbrand_id",this.listingForm.get("brand_id").value)
    const selectedBrand = this.brandsList.find(
      (brand) => brand.id === SelectedbrandID
    );
    this.brandnametoDisplay = selectedBrand ? selectedBrand.name : null;
  }

  onSubmit(Param: string) {
    let isUserLogin = localStorage.getItem("isLoggedIn");
    if (isUserLogin == "false") {
      this.loginFirst();
    }
    if (Param === "listingDetails") {
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
        if (this.isFromMyListingComponent) {
          const formData = {
            ...this.listingForm.value,
            product_id: this.productIDFromResponse,
          };
          this.http.updateListingDetails(formData).subscribe(
            (res) => {
              this.productIDFromResponse = res.data.id;
              localStorage.setItem("productID", res.data.id);
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "success",
                  "Listing Details Add Successfully"
                );
              } else {
                this.alertService.showAlert(
                  "success",
                  "تمت إضافة تفاصيل القائمة بنجاح"
                );
              }

              this.formDirty = true;
              this.selectedOptionsList.push("watchDetails");
              localStorage.setItem(
                "selectedOptionsList",
                this.selectedOptionsList
              );
              this.selectSection("watchDetails");
            },
            (err) => {
              if(err?.error?.message){
                this.alertService.showAlert("warning",`${err?.error?.message}`);
              }
              else if(err?.message){
                this.alertService.showAlert("warning",`${err?.message}`);
              }else{
                if (this.translateService.currentLang == "en") {
                  this.alertService.showAlert(
                    "warning",
                    "Error in adding listing details"
                  );
                } else {
                  this.alertService.showAlert(
                    "warning",
                    "حدث خطأ أثناء إضافة تفاصيل القائمة"
                  );
                }
              }
            }
          );
        } else {
          this.http.addListingDetails(this.listingForm.value).subscribe(
            (res) => {
              this.productIDFromResponse = res.id;
              localStorage.setItem("productID", res.id);
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "success",
                  "Listing Details Add Successfully"
                );
              } else {
                this.alertService.showAlert(
                  "success",
                  "تم إضافة تفاصيل القائمة بنجاح"
                );
              }
              this.formDirty = true;
              this.selectedOptionsList.push("watchDetails");
              localStorage.setItem(
                "selectedOptionsList",
                this.selectedOptionsList
              );
              this.selectSection("watchDetails");
            },
            (err) => {
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in adding listing details"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة تفاصيل القائمة"
                );
              }
            }
          );
        }
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
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("warning", `Please select a brand.`);
            } else {
              this.alertService.showAlert(
                "warning",
                `يرجى اختيار علامة تجارية.`
              );
            }
          } else if (firstInvalidControl == "category_ids") {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                `Please select a category.`
              );
            } else {
              this.alertService.showAlert("warning", `يرجى اختيار فئة.`);
            }
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                `${firstInvalidControl}" is invalid.`
              );
            } else {
              this.alertService.showAlert(
                "warning",
                ` ${firstInvalidControl}" غير صالح.`
              );
            }
          }
        } else {
          // console.log("Form is valid, proceed with submission.");
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("warning", "Enter Form Values");
          } else {
            this.alertService.showAlert("warning", "أدخل قيم النموذج");
          }
        }
      }
    } else if (Param === "watchDetails") {
      if (this.watchDetailsForm.valid) {
        let isUpdate;
        if (this.currentStepper == "listingDetails") {
          isUpdate = 0;
        } else {
          isUpdate = 1;
        }
        const formDataWithProductID = {
          ...this.watchDetailsForm.value,
          product_id: this.productIDFromResponse,
          isUpdate: isUpdate,
        };

        this.http.addWatchDetails(formDataWithProductID).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Watch Details Add Successfully"
              );
            } else {
              this.alertService.showAlert(
                "success",
                "تمت إضافة تفاصيل الساعة بنجاح"
              );
            }
            this.selectedOptionsList.push("uploadImages");
            localStorage.setItem(
              "selectedOptionsList",
              this.selectedOptionsList
            );
            this.selectSection("uploadImages");
          },
          (err) => {
            if(err?.error?.message){
              this.alertService.showAlert("warning",`${err?.error?.message}`);
            }
            else if(err?.message){
              this.alertService.showAlert("warning",`${err?.message}`);
            }else{
            if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in adding listing details"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة تفاصيل القائمة"
                );
              }
            }
          }
        );
      } else {
        this.alertService.showAlert("warning", "Enter Required Form Values");
      }
    } else if (Param === "uploadImages") {

      if (this.allImages.length == 0 || this.allImages.length == 1) {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Please upload at leaset two images."
          );
        } else {
          this.alertService.showAlert("warning","يرجى رفع صورتين على الأقل.");
        }
        return;
      }

      if (!this.coverImage) {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Please upload a cover image."
          );
        } else {
          this.alertService.showAlert("warning", "يرجى تحميل صورة الغلاف.");
        }

        return;
      }

      if (this.allImages.length > 0) {
        this.otherImages = this.allImages;
      }

      if (this.otherImages.length === 0) {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Please upload at least one other image."
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "يرجى تحميل صورة واحدة على الأقل إضافية."
          );
        }
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

      if (this.selectedVideo) {
        formData.append("video", this.selectedVideo || "main_image.jpg");
      }

      // if (this.deleted_video && !this.videoUrl) {
      //   formData.append("deleted_video", this.deleted_video.toString());
      // }

      let isUpdate;
      if (this.currentStepper == "uploadImages") {
        isUpdate = 0;
      } else {
        isUpdate = 1;
      }

      if(isUpdate == 1){

        if(this.removedImagesUrl.length > 0){
          this.removedImagesUrl.forEach((image) => {
            if (image) {
              formData.append(`deleted_images[]`,image.replace(this.apiUrl, ''));
            }
          });
        }

        const mainImageURL = this.apiUrl + this.productDetails.main_image
        // console.log("main image url in Submit Form mainImageURL",mainImageURL)
        // console.log("allImages ",this.allImages)
        // console.log("allImages of first ",this.allImages[0])
        if(mainImageURL == this.allImages[0].url){
          // console.log("WORKING OF MATCHING NAME IMAGEWS")
        }else{
          
          const url = this.allImages[0].url.replace(this.apiUrl, '');
          formData.append('replaced_main_image', url);
        }
     
      }

      formData.append("isUpdate", isUpdate);

      this.otherImages
        .filter((item: ImageFile) => !item.isCover)
        .forEach((image, index) => {
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
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("success", "Images Add Successfully");
          } else {
            this.alertService.showAlert("success", "تمت إضافة الصور بنجاح");
          }
          this.selectedOptionsList.push("conditionGrading");
          localStorage.setItem("selectedOptionsList", this.selectedOptionsList);
          this.selectSection("conditionGrading");
        },
        (err) => {
          if (err && err?.error?.error) {
            this.alertService.showAlert("warning", `${err.error.error}`);
          } else if(err?.error?.message){
            this.alertService.showAlert("warning",`${err?.error?.message}`);
          }
          else if(err?.message){
            this.alertService.showAlert("warning",`${err?.message}`);
          }
          else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("warning", "Error in adding Images");
            } else {
              this.alertService.showAlert(
                "warning",
                "حدث خطأ أثناء إضافة الصور"
              );
            }
          }
        }
      );
    } else if (Param === "conditionGrading") {
      if (this.selectedCondition) {
        // const isUpdate = this.selectedOptionsList.includes("conditionGrading") ? "1" : "0";
        let isUpdate;
        if (this.currentStepper == "conditionGrading") {
          isUpdate = 0;
        } else {
          isUpdate = 1;
        }
        const formData = {
          product_id: this.productIDFromResponse,
          condition: this.selectedCondition.title,
          isUpdate: isUpdate,
        };

        this.http.addCondition(formData).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Condition Add Successfully"
              );
            } else {
              this.alertService.showAlert("success", "تمت إضافة الحالة بنجاح");
            }
            this.selectedOptionsList.push("scopeofdelivery");
            localStorage.setItem(
              "selectedOptionsList",
              this.selectedOptionsList
            );
            this.selectSection("scopeofdelivery");
          },
          (err) => {
            if (err && err?.error?.error) {
              this.alertService.showAlert("warning", `${err.error.error}`);
            } else if(err?.error?.message){
              this.alertService.showAlert("warning",`${err?.error?.message}`);
            }
            else if(err?.message){
              this.alertService.showAlert("warning",`${err?.message}`);
            }else{
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in adding Condition"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة الحالة"
                );
              }
            }
          }
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Select any Option");
        } else {
          this.alertService.showAlert("warning", "اختر أي خيار");
        }
      }
    } else if (Param === "scopeofdelivery") {
      if (this.selectedOptions) {
        // const isUpdate = this.selectedOptionsList.includes("scopeofdelivery") ? "1" : "0";
        let isUpdate;
        if (this.currentStepper == "scopeOfDelivery") {
          isUpdate = 0;
        } else {
          isUpdate = 1;
        }
        const formData = {
          product_id: this.productIDFromResponse,
          scope_of_delivery: this.selectedOptions.title,
          isUpdate: isUpdate,
        };
        this.http.addScopeOfDelivery(formData).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("success", "Scope Add Successfully");
            } else {
              this.alertService.showAlert("success", "تمت إضافة النطاق بنجاح");
            }
            this.selectedOptionsList.push("proofofownership");
            this.selectSection("proofofownership");
            localStorage.setItem(
              "selectedOptionsList",
              this.selectedOptionsList
            );
          },
          (err) => {
            if (err && err?.error?.error) {
              this.alertService.showAlert("warning", `${err.error.error}`);
            } else if(err?.error?.message){
              this.alertService.showAlert("warning",`${err?.error?.message}`);
            }
            else if(err?.message){
              this.alertService.showAlert("warning",`${err?.message}`);
            }
            else{
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert("warning", "Error in adding Scope");
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة النطاق"
                );
              }
            }
          }
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Select any Option");
        } else {
          this.alertService.showAlert("warning", "اختر أي خيار");
        }
      }
    } else if (Param === "proofofownership") {
      if (!this.productIDFromResponse) {
        this.productIDFromResponse = 913;
      }

      if (!this.selectedFiles[0] || !this.selectedFiles[1]) {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Add Images");
        } else {
          this.alertService.showAlert("warning", "إضافة صور");
        }
      } else {
        const formData = new FormData();
        formData.append("product_id", this.productIDFromResponse);
        formData.append("proof_image_1", this.selectedFiles[0]);
        formData.append("proof_image_2", this.selectedFiles[1]);
        formData.append(
          "proof_time_text_1",
          this.formatTime(this.clocks[0].hour, this.clocks[0].minute)
        );
        formData.append(
          "proof_time_text_2",
          this.formatTime(this.clocks[1].hour, this.clocks[1].minute)
        );
        formData.append(
          "generted_time_text_1",
          this.formatTime(this.clocks[0].hour, this.clocks[0].minute)
        );
        formData.append(
          "generted_time_text_2",
          this.formatTime(this.clocks[1].hour, this.clocks[1].minute)
        );
        // const isUpdate = this.selectedOptionsList.includes("proofofownership") ? "1" : "0";
        let isUpdate;
        if (this.currentStepper == "proofOfOwnership") {
          isUpdate = 0;
        } else {
          isUpdate = 1;
        }
        formData.append("isUpdate", isUpdate);
        this.http.addProffofOwnerShip(formData).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Images Added Successfully"
              );
            } else {
              this.alertService.showAlert("success", "تمت إضافة الصور بنجاح");
            }
            this.selectedOptionsList.push("priceshipment");
            localStorage.setItem(
              "selectedOptionsList",
              this.selectedOptionsList
            );
            this.selectSection("priceshipment");
          },
          (err) => {
            if (err && err?.error?.error) {
              this.alertService.showAlert("warning", `${err.error.error}`);
            } else if(err?.error?.message){
              this.alertService.showAlert("warning",`${err?.error?.message}`);
            }
            else if(err?.message){
              this.alertService.showAlert("warning",`${err?.message}`);
            }else{
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert("warning", "Error in adding Images");
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة الصور"
                );
              }
            }
          }
        );
      }
    } else if (Param === "priceshipment") {
      let formData;
      if (
        this.userType === "user" ||
        this.selectedUserTypeofConditionGradingForAdmin === "user"
      ) {
        // const isUpdate = this.selectedOptionsList.includes("priceshipment") ? "1" : "0";
        let isUpdate;
        if (this.currentStepper == "priceAndShipment") {
          isUpdate = 0;
        } else {
          isUpdate = 1;
        }
        formData = {
          product_id: this.productIDFromResponse,
          price: this.watchPrice,
          estimate_payout: this.estimatedPayout,
          isUpdate: isUpdate,
        };
      } else {
        if (!this.watchPrice || !this.shipping_type) {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("info", "Enter Form Values");
          } else {
            this.alertService.showAlert("info", "أدخل قيم النموذج");
          }
          return;
        } else {
          if (
            this.shipping_type === "inclusiveShipping" &&
            !this.shipping_charges
          ) {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("info", "Enter Form Values");
            } else {
              this.alertService.showAlert("info", "أدخل قيم النموذج");
            }
            return;
          } else {
            // const isUpdate = this.selectedOptionsList.includes("priceshipment") ? "1" : "0";
            let isUpdate;
            if (this.currentStepper == "priceAndShipment") {
              isUpdate = 0;
            } else {
              isUpdate = 1;
            }
            formData = {
              product_id: this.productIDFromResponse,
              price: this.watchPrice,
              shipping_type: this.shipping_type,
              shipping_charges: this.shipping_charges,
              // estimate_delivery: this.estimate_delivery,
              allow_to_make_offer: this.allow_to_make_offer,
              estimate_payout: this.estimatedPayoutwithShipping,
              isUpdate: isUpdate,
            };
          }
        }
      }

      if (FormData) {
        this.http.addpriceAndShipment(formData).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Price and Shipment Add Successfully"
              );
            } else {
              this.alertService.showAlert(
                "success",
                "تمت إضافة السعر والشحن بنجاح"
              );
            }
            // const isUpdate = this.selectedOptionsList.includes("priceshipment") ? "1" : "0";
            let isUpdate;
            if (this.currentStepper == "priceAndShipment") {
              isUpdate = 0;
            } else {
              isUpdate = 1;
            }
            const priceandShipment = {
              price: this.watchPrice,
              shipping_type: this.shipping_type,
              shipping_charges: this.shipping_charges,
              // estimate_delivery: this.estimate_delivery,
              allow_to_make_offer: this.allow_to_make_offer,
              estimate_payout: this.estimatedPayoutwithShipping,
              isUpdate: isUpdate,
            };

            this.selectedOptionsList.push("billinginformation");
            localStorage.setItem(
              "selectedOptionsList",
              this.selectedOptionsList
            );
            this.selectSection("billinginformation");
          },
          (err) => {
            if (err && err?.error?.error) {
              this.alertService.showAlert("warning", `${err.error.error}`);
            } else if(err?.error?.message){
              this.alertService.showAlert("warning",`${err?.error?.message}`);
            }
            else if(err?.message){
              this.alertService.showAlert("warning",`${err?.message}`);
            }
            else{
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in adding Price and Shipment"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة السعر والشحن"
                );
              }
            }
          }
        );
      }
    } else if (Param === "billinginformation") {
      if (this.billingForm.valid) {
        // const isUpdate = this.selectedOptionsList.includes("billinginformation") ? "1" : "0";
        let isUpdate;
        if (this.currentStepper == "billingInformation") {
          isUpdate = 0;
        } else {
          isUpdate = 1;
        }
        const formDataWithProductID = {
          ...this.billingForm.value,
          product_id: this.productIDFromResponse,
          isUpdate: isUpdate,
        };

        this.http.addbillingInformation(formDataWithProductID).subscribe(
          (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Billing Info Add Successfully"
              );
            } else {
              this.alertService.showAlert(
                "success",
                "تمت إضافة معلومات الفوترة بنجاح"
              );
            }
            this.matchBrandname();
            this.selectedOptionsList.push("summary");
            localStorage.setItem(
              "selectedOptionsList",
              this.selectedOptionsList
            );
            this.selectSection("summary");
          },
          (err) => {
            if (err && err?.error?.error) {
              this.alertService.showAlert("warning", `${err.error.error}`);
            } else if(err?.error?.message){
              this.alertService.showAlert("warning",`${err?.error?.message}`);
            }
            else if(err?.message){
              this.alertService.showAlert("warning",`${err?.message}`);
            }else{
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in adding Billing Info"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة معلومات الفوترة"
                );
              }
            }
          }
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Add Form Values");
        } else {
          this.alertService.showAlert("warning", "إضافة قيم النموذج");
        }
      }
    } else if (Param === "summary") {
      const formProductID = {
        product_id: this.productIDFromResponse,
      };
      this.http.addbpublishListing(formProductID).subscribe(
        (res) => {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "success",
              "Product Publish Successfully"
            );
          } else {
            this.alertService.showAlert("success", "تم نشر المنتج بنجاح");
          }
          this.formDirty = false;
          this.router.navigate(["/"]);
        },
        (err) => {
          if (err && err?.error?.error) {
            this.alertService.showAlert("warning", `${err.error.error}`);
          } else if(err?.error?.message){
            this.alertService.showAlert("warning",`${err?.error?.message}`);
          }
          else if(err?.message){
            this.alertService.showAlert("warning",`${err?.message}`);
          }else{
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                "Error in Product Publishing"
              );
            } else {
              this.alertService.showAlert("warning", "حدث خطأ أثناء نشر المنتج");
            }
          }
        }
      );
    }
  }

  cancelbtn() {
    this.router.navigate(["/"]);
  }

  backbtn(param: string) {
    this.getOnlyDetails();
    this.selectSection(param);
  }

  async routeToProductDetail() {
    this.formDirty = false;
    let backUpProduct;
    this.http
      .getProductDetailsByID(this.productIDFromResponse)
      .subscribe((res) => {
        backUpProduct = res.product;
        if (backUpProduct.main_image) {
          backUpProduct.main_image = backUpProduct.main_image.replace(
            /\\/g,
            ""
          );
        }

        if (backUpProduct.additional_images) {
          try {
            backUpProduct.additional_images = JSON.parse(
              backUpProduct.additional_images
            ).map((image) => image.replace(/\\/g, ""));
          } catch (e) {
            console.error("Failed to parse additional_images", e);
          }
        }
      });

    this.router.navigate(["/buy-product"], {
      state: {
        param: "listing-to-product",
        ID: this.productIDFromResponse,
        data: backUpProduct,
      },
    });
  }

  moveToForm(formName) {
    if (formName === "listingDetails") {
      if (
        this.selectedOptionsList.includes("listingDetails") &&
        this.selectedSection !== "listingDetails"
      ) {
        this.getOnlyDetails();
        this.selectSection("listingDetails");
      }
    } else if (formName === "watchDetails") {
      if (
        this.selectedOptionsList.includes("watchDetails") &&
        this.selectedSection !== "watchDetails"
      ) {
        this.getOnlyDetails();
        this.selectSection("watchDetails");
      }
    } else if (formName === "uploadImages") {
      if (
        this.selectedOptionsList.includes("uploadImages") &&
        this.selectedSection !== "uploadImages"
      ) {
        this.getOnlyDetails();
        this.selectSection("uploadImages");
      }
    } else if (formName === "conditionGrading") {
      if (
        this.selectedOptionsList.includes("conditionGrading") &&
        this.selectedSection !== "conditionGrading"
      ) {
        this.getOnlyDetails();
        this.selectSection("conditionGrading");
      }
    } else if (formName === "scopeofdelivery") {
      if (
        this.selectedOptionsList.includes("scopeofdelivery") &&
        this.selectedSection !== "scopeofdelivery"
      ) {
        this.getOnlyDetails();
        this.selectSection("scopeofdelivery");
      }
    } else if (formName === "proofofownership") {
      if (
        this.selectedOptionsList.includes("proofofownership") &&
        this.selectedSection !== "proofofownership"
      ) {
        this.getOnlyDetails();
        this.selectSection("proofofownership");
      }
    } else if (formName === "priceshipment") {
      if (
        this.selectedOptionsList.includes("priceshipment") &&
        this.selectedSection !== "priceshipment"
      ) {
        this.getOnlyDetails();
        this.selectSection("priceshipment");
      }
    } else if (formName === "billinginformation") {
      if (
        this.selectedOptionsList.includes("billinginformation") &&
        this.selectedSection !== "billinginformation"
      ) {
        this.getOnlyDetails();
        this.selectSection("billinginformation");
      }
    } else if (formName === "summary") {
      if (
        this.selectedOptionsList.includes("summary") &&
        this.selectedSection !== "summary"
      ) {
        this.getOnlyDetails();
        this.selectSection("summary");
      }
    }
  }
}
