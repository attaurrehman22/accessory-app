import {Component,OnInit,signal,ElementRef,ViewChild, computed} from "@angular/core";
import {FormBuilder,FormControl,FormGroup,Validators} from "@angular/forms";
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
  selectedOptionsList:any=['listingDetails'];
  formDirty = false;
  isSmallScreen: boolean = false;
  panelOpenState = false;
  panelDialOpenState = false;
  panelStrapOpenState = false;
  coverImage: { file: File; url: string } | null = null;
  otherImages: ImageFile[] = [];
  isCoverImageUploading = false;
  productIDFromResponse: any;
  isAdminUser = computed(() => this.loginStateService.isAdminUser());
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
    private loginStateService: LoginStateService,
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
      title: "Original Box & Original Papers",
      icon: "../assets/images/original-box-papers.png",
    },
    {
      title: "Original Box",
      icon: "../assets/images/original-box.png",
    },
    {
      title: "Original Papers",
      icon: "/assets/images/original-papers.png",
    },
    {
      title: "Watch Only",
      icon: "/assets/images/watch-only.png",
    }
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

  conditions = [
    {
      title: "Like New & Unworn",
      description:
        "The item has no signs of wear such as scraches or dents and is unworn. The item has not been polished.",
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
      description:
        "The item is missing some parts and is not functional.",
    }
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
  userType: any;
  isFromMyListingComponent:boolean=false;
  isAdminLogin:boolean=false;

  productDetails:any;
  latestActiveForm:string='';
  isNextButtonShowonBillingInformation:boolean=false;
  isNextButtonShowonProofofOwnerShip:boolean=false;
  isNextButtonShowonScopeOfdelivery:boolean=false;

  nextMoveToSummary(){
    this.selectSection("summary");
  }

  nextMoveToBillingInformation(){
    this.selectSection("priceshipment");
  }

  nextMoveToScopeOfDelivery(){
    this.selectSection("scopeofdelivery");
  }

  getProductDetails(){
      this.http.getProductDetailsByID(this.productIDFromResponse).subscribe(
        (res)=>{
          this.productDetails=res.product;
          this.latestActiveForm=res.step;

          if (this.productDetails.main_image) {
            this.productDetails.main_image = this.productDetails.main_image.replace(/\\/g, '');
          }
    
          if (this.productDetails.additional_images) {
            try {
              this.productDetails.additional_images = JSON.parse(this.productDetails.additional_images)
                .map(image => image.replace(/\\/g, '')); 
            } catch (e) {
              console.error('Failed to parse additional_images', e);
            }
          }

          if (this.productDetails.proof_image_1) {
            this.productDetails.proof_image_1 = this.productDetails.proof_image_1.replace(/\\/g, '');
          }

          if (this.productDetails.proof_image_2) {
            this.productDetails.proof_image_2 = this.productDetails.proof_image_2.replace(/\\/g, '');
          }

          if (this.latestActiveForm === 'completed' || this.latestActiveForm === 'publishListing') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
              'conditionGrading',
              'scopeofdelivery',
              'proofofownership',
              'priceshipment',
              'billinginformation',
              'summary'
            ]);
            this.isNextButtonShowonBillingInformation=true;
            this.isNextButtonShowonProofofOwnerShip=true
            this.isNextButtonShowonScopeOfdelivery=true
            this.selectSection("summary");
          }
          if (this.latestActiveForm === 'billingInformation') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
              'conditionGrading',
              'scopeofdelivery',
              'proofofownership',
              'priceshipment',
              'billinginformation',
            ]);
            this.isNextButtonShowonBillingInformation=true;
            this.isNextButtonShowonProofofOwnerShip=true;
            this.isNextButtonShowonScopeOfdelivery=true
            this.selectSection("summary");
          }

          if (this.latestActiveForm === 'priceAndShipment') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
              'conditionGrading',
              'scopeofdelivery',
              'proofofownership',
              'priceshipment',
            ]);
            this.isNextButtonShowonProofofOwnerShip=true;
            this.isNextButtonShowonScopeOfdelivery=true
            this.selectSection("billingInformation");
          }

          if (this.latestActiveForm === 'proofOfOwnership') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
              'conditionGrading',
              'scopeofdelivery',
              'proofofownership',
            ]);
            this.isNextButtonShowonProofofOwnerShip=true;
            this.isNextButtonShowonScopeOfdelivery=true
            this.selectSection("priceshipment");
          }

          if (this.latestActiveForm === 'scopeOfDelivery') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
              'conditionGrading',
              'scopeofdelivery',
            ]);
            this.isNextButtonShowonScopeOfdelivery=true;
            this.selectSection("proofofownership");
          }

          if (this.latestActiveForm === 'conditionGrading') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
              'conditionGrading',
            ]);
            this.isNextButtonShowonScopeOfdelivery=true;
            this.selectSection("scopeofdelivery");
          }

          if (this.latestActiveForm === 'uploadImages') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
              'uploadImages',
            ]);
            this.selectSection("conditionGrading");
          }

          if (this.latestActiveForm === 'watchDetails') {
            this.selectedOptionsList = this.selectedOptionsList.concat([
              'watchDetails',
            ]);
            this.selectSection("uploadImages");
          }

          if (this.latestActiveForm === 'listingDetails') {
            this.selectSection("watchDetails");
          }

          this.patchFormDetails()
        }
      )
  }

  patchFormDetails(){
    // listingForm
    this.listingForm.get('brand_id').setValue(this.productDetails.brand_id);
    if (this.productDetails.brand_id) {
        this.listingForm.get('brand_id').disable();
    }

    let ids = this.productDetails.categories.map((item: any) => item.id);
    this.listingForm.get('category_ids').setValue(ids);
    if (ids.length > 0) {
        this.listingForm.get('category_ids').disable();
    }

    this.listingForm.get('name').setValue(this.productDetails.name);
    if (this.productDetails.name) {
        this.listingForm.get('name').disable();
    }

    this.listingForm.get('model').setValue(this.productDetails.model);
    if (this.productDetails.model) {
        this.listingForm.get('model').disable();
    }

    this.listingForm.get('title').setValue(this.productDetails.title);
    if (this.productDetails.title) {
        this.listingForm.get('title').disable();
    }
    this.listingForm.get('description').setValue(this.productDetails.description)
    this.listingForm.get('watch_type').setValue(this.productDetails.watch_type);
    if (this.productDetails.watch_type) {
        this.listingForm.get('watch_type').disable();
    }

    // Additional fields with checks
    this.listingForm.get('year_of_production').setValue(this.productDetails.year_of_production);
    if (this.productDetails.year_of_production) {
        this.listingForm.get('year_of_production').disable();
    }

    this.listingForm.get('approximation').setValue(this.productDetails.approximate_year);
    if (this.productDetails.approximate_year) {
        this.listingForm.get('approximation').disable();
    }
    // this.listingForm.get('unknown').setValue(this.productDetails.)

    // watchDetailsForm 
    this.watchDetailsForm.get('reference_number').setValue(this.productDetails.reference_number);

    if(this.productDetails.reference_number){
      this.watchDetailsForm.get('reference_number').disable();
    }
    
    this.watchDetailsForm.get('serial_no').setValue(this.productDetails.serial_no);

    if(this.productDetails.serial_no){
      this.watchDetailsForm.get('serial_no').disable();
    }

    this.watchDetailsForm.get('gender').setValue(this.productDetails.gender);
    this.watchDetailsForm.get('movement').setValue(this.productDetails.movement);
    this.watchDetailsForm.get('case_diameter_value_1').setValue(this.productDetails.case_diameter_value_1);
    this.watchDetailsForm.get('case_diameter_value_2').setValue(this.productDetails.case_diameter_value_2);
    this.watchDetailsForm.get('dial_color').setValue(this.productDetails.dial_color);
    this.watchDetailsForm.get('caliber_movement').setValue(this.productDetails.caliber_movement);
    this.watchDetailsForm.get('base_caliber').setValue(this.productDetails.base_caliber);
    this.watchDetailsForm.get('power_reserve').setValue(this.productDetails.power_reserve);
    this.watchDetailsForm.get('no_of_jewels').setValue(this.productDetails.no_of_jewels);
    this.watchDetailsForm.get('frequency').setValue(this.productDetails.frequency);
    this.watchDetailsForm.get('additional_details').setValue(this.productDetails.additional_details);
    this.watchDetailsForm.get('case_material').setValue(this.productDetails.case_material);
    this.watchDetailsForm.get('bezel_material').setValue(this.productDetails.bezel_material);
    this.watchDetailsForm.get('thickness').setValue(this.productDetails.thickness);
    this.watchDetailsForm.get('crystal').setValue(this.productDetails.crystal);
    this.watchDetailsForm.get('water_resistance').setValue(this.productDetails.water_resistance);
    this.watchDetailsForm.get('dial_numerals').setValue(this.productDetails.dial_numerals);
    this.watchDetailsForm.get('bracelet_material').setValue(this.productDetails.bracelet_material);
    this.watchDetailsForm.get('bracelet_color').setValue(this.productDetails.bracelet_color);
    this.watchDetailsForm.get('type_of_clasp').setValue(this.productDetails.type_of_clasp);
    this.watchDetailsForm.get('clasp_material').setValue(this.productDetails.clasp_material);
    

   // billingForm 
   this.billingForm.get('billing_address').setValue(this.productDetails.billing_address || '');
    if (this.productDetails.billing_address) {
        this.billingForm.get('billing_address').disable();
    }

    this.billingForm.get('first_name').setValue(this.productDetails.first_name || '');
    if (this.productDetails.first_name) {
        this.billingForm.get('first_name').disable();
    }

    this.billingForm.get('last_name').setValue(this.productDetails.last_name || '');
    if (this.productDetails.last_name) {
        this.billingForm.get('last_name').disable();
    }

    this.billingForm.get('street').setValue(this.productDetails.street || '');
    if (this.productDetails.street) {
        this.billingForm.get('street').disable();
    }

    this.billingForm.get('street_line_2').setValue(this.productDetails.street_line_2 || '');
    if (this.productDetails.street_line_2) {
        this.billingForm.get('street_line_2').disable();
    }

    this.billingForm.get('zip_code').setValue(this.productDetails.zip_code || '');
    if (this.productDetails.zip_code) {
        this.billingForm.get('zip_code').disable();
    }

    this.billingForm.get('city').setValue(this.productDetails.city || '');
    if (this.productDetails.city) {
        this.billingForm.get('city').disable();
    }

    // PriceandShipment
    this.watchPrice = this.productDetails.price;
    this.shipping_type = this.productDetails.shipping_type;
    this.shipping_charges = this.productDetails.shipping_charges;
    this.estimate_delivery = this.productDetails.estimate_delivery;
    this.allow_to_make_offer = this.productDetails.allow_to_make_offer;
    this.estimatedPayoutwithShipping = this.productDetails.estimate_payout;
  
    // If the form has a method to calculate payout
    this.calculatePayout();

    // Condition
    let selectedCondition;
    if(this.userType === 'dealer'){
    
    
      selectedCondition = this.dealerconditions.find(
        (condition) =>
          condition.title === this.productDetails.condition
      );

     this.dealerconditions = [selectedCondition]

    }else{
      selectedCondition = this.conditions.find(
        (condition) =>
          condition.title === this.productDetails.condition
      );
      // selectedCondition=this.conditions.filter((item:any)=>{item.title === this.productDetails.condition})
      this.conditions = [selectedCondition]
    }

    this.selectCondition(selectedCondition);
  


    //scopeofDelivery
    const scopeofDelivery = this.options.find(
      (option) => option.title === this.productDetails.scope_of_delivery
    );

    this.selectedOptions=scopeofDelivery

    this.coverImage = { file: null, url: 'https://api.chronosouq.com/'+this.productDetails.main_image };
    console.log(" this.coverImage", this.coverImage)


    if(this.productDetails.additional_images){
      this.otherImages = this.productDetails.additional_images.map(
        (img: { url: string }) => ({
          file: null,
          url: 'https://api.chronosouq.com/'+img,
          isUploading: false,
        })
      );
    }
   if(this.productDetails?.proof_image_1){
    this.isEnableProofofOwnerShip=true
     this.imagePreviews[0]='https://api.chronosouq.com/'+this.productDetails.proof_image_1;
   }
   if(this.productDetails?.proof_image_2){
      this.isEnableProofofOwnerShip=true
    this.imagePreviews[1]='https://api.chronosouq.com/'+this.productDetails.proof_image_2;
  }
  }

  isEnableProofofOwnerShip:boolean=false

  ngOnInit() {

    if(!this.productIDFromResponse){
      this.productIDFromResponse=localStorage.getItem('productID');
      const selectedOptionsListString = localStorage.getItem('selectedOptionsList');

      if (selectedOptionsListString) {
        const selectedOptionsList = selectedOptionsListString;
        console.log("selectedOptionsList",selectedOptionsList)
        // Assign the last element of the list to selectedSection
        if (selectedOptionsList.length > 0) {
          this.selectedSection = selectedOptionsList[selectedOptionsList.length - 1];
        }
      }
    }
    if(this.productIDFromResponse){
      this.getProductDetails()
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        localStorage.removeItem('productID');
        localStorage.removeItem('selectedOptionsList');
      }
    });
    
    if(this.isAdminUser() === true){
      console.log("isAdminUser in header comp", this.isAdminUser());
      this.isAdminLogin=true;
    }
    let isUserLogin = localStorage.getItem("isLoggedIn");
    this.userType = localStorage.getItem("userType");
    if (!isUserLogin) {
      this.loginFirst();
    }
    if(history?.state){
      if (history?.state?.ID) {
        this.productIDFromResponse = history.state.ID;
        this.selectedSection = "summary";
        this.calculatePayout();
        this.formDirty = true;
      }
      if(history?.state?.productID){
        this.productIDFromResponse=history?.state?.productID;
        this.isFromMyListingComponent=true;
        this.getProductDetails()
      }
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
  }

  selectedUserTypeofConditionGradingForAdmin:any;

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  selectSection(section: string) {
    console.log("Section",section)
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
    console.log("isUserLogin")
    console.log("isUserLogin",localStorage.getItem("isLoggedIn"))
    let isUserLogin = localStorage.getItem("isLoggedIn");
    console.log("isUserLogin",isUserLogin)
    if (isUserLogin == 'false') {
      this.loginFirst();
    }
      if (Param === "listingDetails") {
        if (this.listingForm.valid) {
          if(this.isFromMyListingComponent){
            const formData={...this.listingForm.value , product_id:this.productIDFromResponse}
            this.http.updateListingDetails(formData).subscribe(
              (res) => {
                this.productIDFromResponse = res.id;
                localStorage.setItem('productID', res.id);
                this.alertService.showAlert(
                  "success",
                  "Listing Details Add Successfully"
                );
              
                this.formDirty = true;
                this.selectedOptionsList.push('watchDetails')
                localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
                this.selectSection("watchDetails");
              },
              (err) => {
                this.alertService.showAlert(
                  "danger",
                  "Error in adding listing details"
                );
              }
            );
          }else{
            this.http.addListingDetails(this.listingForm.value).subscribe(
              (res) => {
                this.productIDFromResponse = res.id;
                localStorage.setItem('productID', res.id);
                this.alertService.showAlert(
                  "success",
                  "Listing Details Add Successfully"
                );
                this.formDirty = true;
                this.selectedOptionsList.push('watchDetails')
                localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
                this.selectSection("watchDetails");
              },
              (err) => {
                this.alertService.showAlert(
                  "danger",
                  "Error in adding listing details"
                );
              }
            );
          }
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
              this.selectedOptionsList.push('uploadImages')
              localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
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
            this.selectedOptionsList.push('conditionGrading')
            localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
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
              this.selectedOptionsList.push('scopeofdelivery')
              localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
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
              this.selectedOptionsList.push('proofofownership')
              localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
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

        if(!this.productIDFromResponse){
          this.productIDFromResponse=913
        }

        if (!this.selectedFiles[0] || !this.selectedFiles[1]) {
          this.alertService.showAlert("warning", "Add Images");
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
          this.http.addProffofOwnerShip(formData).subscribe(
            (res) => {
              this.alertService.showAlert("success", "Images Added Successfully");
              this.selectedOptionsList.push('priceshipment')
              localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
              this.selectSection("priceshipment");
            },
            (err) => {
              this.alertService.showAlert("danger", "Error in adding Images");
            }
          );
        }
      } else if (Param === "priceshipment") {
        let formData;
        if (this.userType === "user" || this.selectedUserTypeofConditionGradingForAdmin === 'user') {
          formData = {
            product_id: this.productIDFromResponse,
            price: this.watchPrice,
            estimate_payout: this.estimatedPayout,
          };
        } else {
          if (
            !this.watchPrice ||
            !this.shipping_type ||
            !this.shipping_charges ||
            !this.estimate_delivery ||
            !this.estimatedPayoutwithShipping
          ) {
            this.alertService.showAlert("info", "Enter Form Values");
          } else {
            formData = {
              product_id: this.productIDFromResponse,
              price: this.watchPrice,
              shipping_type: this.shipping_type,
              shipping_charges: this.shipping_charges,
              estimate_delivery: this.estimate_delivery,
              allow_to_make_offer: this.allow_to_make_offer,
              estimate_payout: this.estimatedPayoutwithShipping,
            };
          }
        }

        if(FormData){
          this.http.addpriceAndShipment(formData).subscribe(
            (res) => {
              this.alertService.showAlert(
                "success",
                "Price and Shipment Add Successfully"
              );

              const priceandShipment = {
                price: this.watchPrice,
                shipping_type: this.shipping_type,
                shipping_charges: this.shipping_charges,
                estimate_delivery: this.estimate_delivery,
                allow_to_make_offer: this.allow_to_make_offer,
                estimate_payout: this.estimatedPayoutwithShipping,
              };
        
              this.selectedOptionsList.push('billinginformation')
              localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
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
              this.selectedOptionsList.push('summary')
              localStorage.setItem('selectedOptionsList', this.selectedOptionsList);
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
    this.formDirty = false;
    this.router.navigate(["/buy-product"], {
      state: { param: "listing-to-product", ID: this.productIDFromResponse },
    });
  }


  moveToForm(formName){
    if(formName === 'listingDetails'){
      if(this.selectedOptionsList.includes('listingDetails') && this.selectedSection !== 'listingDetails'){
        this.selectSection('listingDetails')
      }
    }
    else if(formName === 'watchDetails'){
      if(this.selectedOptionsList.includes('watchDetails') && this.selectedSection !== 'watchDetails'){
        this.selectSection('watchDetails')
      }
    }
    else if(formName === 'uploadImages'){
      if(this.selectedOptionsList.includes('uploadImages') && this.selectedSection !== 'uploadImages'){
        this.selectSection('uploadImages')
      }
    }
    else if(formName === 'conditionGrading'){
      if(this.selectedOptionsList.includes('conditionGrading') && this.selectedSection !== 'conditionGrading'){
        this.selectSection('conditionGrading')
      }
    }
    else if(formName === 'scopeofdelivery'){
      if(this.selectedOptionsList.includes('scopeofdelivery') && this.selectedSection !== 'scopeofdelivery'){
        this.selectSection('scopeofdelivery')
      }
    }
    else if(formName === 'proofofownership'){
      if(this.selectedOptionsList.includes('proofofownership') && this.selectedSection !== 'proofofownership'){
        this.selectSection('proofofownership')
      }
    }
    else if(formName === 'priceshipment'){
      if(this.selectedOptionsList.includes('priceshipment') && this.selectedSection !== 'priceshipment'){
        this.selectSection('priceshipment')
      }
    }
    else if(formName === 'billinginformation'){
      if(this.selectedOptionsList.includes('billinginformation') && this.selectedSection !== 'billinginformation'){
        this.selectSection('billinginformation')
      }
    }
    else if(formName === 'summary'){
      if(this.selectedOptionsList.includes('summary') && this.selectedSection !== 'summary'){
        this.selectSection('summary')
      }
    }
  }

}
