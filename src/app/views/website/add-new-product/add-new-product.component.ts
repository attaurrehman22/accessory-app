import { Component, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})
export class AddNewProductComponent implements OnInit {
  productForm: FormGroup;
  usedCondition: any;
  newCondition: any = "";
  // selectedCondition: string | null = null;
  brandsList: any;

  name: FormControl = new FormControl("", Validators.required);
  // warranty: FormControl = new FormControl("", Validators.required);
  // box: FormControl = new FormControl("", Validators.required);
  // papers: FormControl = new FormControl("", Validators.required);
  // availability: FormControl = new FormControl("", Validators.required);
  // sale_status: FormControl = new FormControl("", Validators.required);
  // stock_status: FormControl = new FormControl("", Validators.required);
  category_id: FormControl = new FormControl(1, Validators.required);
  title: FormControl = new FormControl("", Validators.required);
  // slug: FormControl = new FormControl("", Validators.required);
  additional_images: FormControl = new FormControl([]);
  watch_type: FormControl = new FormControl("", Validators.required);
  brand_id: FormControl = new FormControl("", Validators.required);
  model: FormControl = new FormControl("", [
    Validators.required,
    Validators.min(0),
  ]);
  reference_number: FormControl = new FormControl("", [
    Validators.required,
    Validators.min(1),
  ]);
  condition: FormControl = new FormControl("New", Validators.required);
  gender: FormControl = new FormControl("", Validators.required);
  year_of_production: FormControl = new FormControl("", Validators.required);
  // approximation: FormControl = new FormControl(false);
  // unknown: FormControl = new FormControl(false);

  case_diameter: FormControl = new FormControl("", Validators.required);
  // caseDiameterHeight: FormControl = new FormControl("", Validators.required);
  scope_of_delivery: FormControl = new FormControl("", Validators.required);

  movement: FormControl = new FormControl("", Validators.required);
  meta_description: FormControl = new FormControl("", Validators.required);
  description: FormControl = new FormControl("",);
  price: FormControl = new FormControl("", Validators.required);
  currency: FormControl = new FormControl("USD", Validators.required);
  // caliberMovement: FormControl = new FormControl("");
  // baseCaliber: FormControl = new FormControl("");
  // powerReserve: FormControl = new FormControl("");
  // numberOfJewels: FormControl = new FormControl("");
  // frequency: FormControl = new FormControl("");
  // frequencyUnit: FormControl = new FormControl("ah");
  // genevianSeal: FormControl = new FormControl(false);
  // chronometer: FormControl = new FormControl(false);
  // masterChronometer: FormControl = new FormControl(false);
  case_material: FormControl = new FormControl("");
  bezel_material: FormControl = new FormControl("");
  // thickness: FormControl = new FormControl("");
  // crystal: FormControl = new FormControl("");
  water_resistance: FormControl = new FormControl("");
  // displayBack: FormControl = new FormControl(false);
  // gemstonesDiamonds: FormControl = new FormControl(false);
  // pvddlcCoating: FormControl = new FormControl(false);
  dial_color: FormControl = new FormControl("");
  // dialNumerals: FormControl = new FormControl("");
  // guillocheDial: FormControl = new FormControl(false);
  // guillocheDialHandwork: FormControl = new FormControl(false);
  // luminousNumerals: FormControl = new FormControl(false);
  // luminousIndices: FormControl = new FormControl(false);
  // centralSeconds: FormControl = new FormControl(false);
  // smallSeconds: FormControl = new FormControl(false);
  // luminousHands: FormControl = new FormControl(false);
  // temperedBlueHands: FormControl = new FormControl(false);

  bracelet_material: FormControl = new FormControl("");

  // braceletColor: FormControl = new FormControl("");
  // typeOfClasp: FormControl = new FormControl("");
  // claspMaterial: FormControl = new FormControl("");

  commission_fee: FormControl = new FormControl(0);
  // -------------- Extra ---------------------------

  main_image: FormControl = new FormControl("", Validators.required);
  // additional_images:FormControl= new FormControl([], Validators.required);
  // meta_title:FormControl= new FormControl("", Validators.required);
  // meta_description:FormControl= new FormControl("", Validators.required);
  // meta_keywords:FormControl= new FormControl("");
  // location: FormControl = new FormControl("");
  // features: FormControl = new FormControl("");

  // -------------- Extra End ---------------------------

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    public translateService: TranslateService,
    private router: Router
  ) {
    const supportedLanguages = ["en", "ar", "fr", "ta", "hi"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  selectedCondition: string | null = null;
  newUnwarnCondition:string | null = null;

  selectUsedCondition(condition: string) {
    this.selectedCondition = condition;
    this.selectedUsedCondition = condition;
    this.productForm.get("condition")?.setValue(condition);
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  ngOnInit(): void {
    this.getAllProductDropDown();
    if (!this.newCondition) {
      this.newCondition = "new";
    }
    // this.selectedCondition = "new";
    this.createForm();
    this.getBrandsDropdown();
    this.getCategoryDropdown();
  }

  allDropDownList: any;

  getAllProductDropDown() {
    this.http.getPrductFormDropDnCategory().subscribe(
      (res) => {
        this.allDropDownList = res.data;
      },
      (err) => {
        console.log(err)
      }
    );
  }

  imagePreview: string[] = [];

  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files); // Multiple files are selected

      // Store the files directly in the form control
      this.productForm.patchValue({
        additional_images: files, // Store array of files in the form control
      });

      console.log("files ", files);

      this.imagePreview = []; // Initialize the image preview array

      // Create preview for each image
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview.push(reader.result as string); // Push base64 URL to imagePreview array
        };
        reader.readAsDataURL(file); // Convert file to base64 URL
      });
    }
  }

  categoryList: any;

  getCategoryDropdown() {
    this.http.getCategory().subscribe(
      (response: any) => {
        this.categoryList = response.data;
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getBrandsDropdown() {
    this.http.getAllBrands().subscribe(
      (response: any) => {
        this.brandsList = response.data;
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onmain_img_FileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.main_image.setValue(file);
    }
  }

  createForm() {
    this.productForm = this.fb.group({
      name: this.name,
      commission_fee: this.commission_fee,
      scope_of_delivery: this.scope_of_delivery,
      // warranty: this.warranty,
      // box: this.box,
      // papers: this.papers,
      // availability: this.availability,
      // sale_status: this.sale_status,
      // stock_status: this.stock_status,
      category_id: this.category_id,
      title: this.title,
      // slug: this.slug,
      additional_images: this.additional_images,
      watch_type: this.watch_type,
      brand_id: this.brand_id,
      model: this.model,
      main_image: this.main_image,
      meta_description: this.meta_description,
      // location: this.location,
      // features: this.features,
      reference_number: this.reference_number,
      condition: this.condition,
      description: this.description,
      gender: this.gender,
      year_of_production: this.year_of_production,
      // approximation: this.approximation,
      // unknown: this.unknown,
      case_diameter: this.case_diameter,
      // caseDiameterHeight: this.caseDiameterHeight,
      movement: this.movement,
      price: this.price,
      currency: this.currency,
      // caliberMovement: this.caliberMovement,
      // baseCaliber: this.baseCaliber,
      // powerReserve: this.powerReserve,
      // numberOfJewels: this.numberOfJewels,
      // frequency: this.frequency,
      // frequencyUnit: this.frequencyUnit,
      // genevianSeal: this.genevianSeal,
      // chronometer: this.chronometer,
      // masterChronometer: this.masterChronometer,
      case_material: this.case_material,
      bezel_material: this.bezel_material,
      // thickness: this.thickness,
      // crystal: this.crystal,
      water_resistance: this.water_resistance,
      // displayBack: this.displayBack,
      // gemstonesDiamonds: this.gemstonesDiamonds,
      // pvddlcCoating: this.pvddlcCoating,
      dial_color: this.dial_color,
      // dialNumerals: this.dialNumerals,
      // guillocheDial: this.guillocheDial,
      // guillocheDialHandwork: this.guillocheDialHandwork,
      // luminousNumerals: this.luminousNumerals,
      // luminousIndices: this.luminousIndices,
      // centralSeconds: this.centralSeconds,
      // smallSeconds: this.smallSeconds,
      // luminousHands: this.luminousHands,
      // temperedBlueHands: this.temperedBlueHands,
      bracelet_material: this.bracelet_material,
      // braceletColor: this.braceletColor,
      // typeOfClasp: this.typeOfClasp,
      // claspMaterial: this.claspMaterial,
    });
  }

  img_list: any[];

  onSubmit() {
    this.productForm.markAllAsTouched();

    const formData: FormData = new FormData();
    Object.keys(this.productForm.controls).forEach((key) => {
      const controlValue = this.productForm.get(key)?.value;

      if (key === "main_image") {
        formData.append(key, controlValue);
      } else if (key === "additional_images") {
        for (let i = 0; i < controlValue.length; i++) {
          // Append each file to the FormData object with the key as 'additional_images[]'
          formData.append(`${key}[]`, controlValue[i]);
        }
      } else {
        formData.append(key, controlValue ?? "");
      }
    });

    console.log("formData", formData);
    // if (this.productForm.valid) {
    this.http.addProduct(formData).subscribe((reponse) => {
      console.log("Data saved");
      this.router.navigate(["/product-list"]);
    });
    console.log("Product Data:", this.productForm.value);
    // } else {
    //   console.log("Form is invalid", this.productForm.value);
    // }
  }

  panelOpenState = false;
  selectedUsedCondition: string | null = null;

  openCondition(param: string) {
    console.log(param);
    this.selectedCondition = param;

    if (param === "New") {
      this.newCondition = "New";
      this.usedCondition = "";
      this.newUnwarnCondition=""
      this.productForm.get("condition")?.setValue("New");
    }else if(param === "New-Unwarn"){
      this.newCondition = "";
      this.usedCondition = "";
      this.newUnwarnCondition="New-Unwarn"
      this.productForm.get("condition")?.setValue("Like new and unworn");
    }
     else {
      this.usedCondition = "Used";
      this.newCondition = "";
      this.newUnwarnCondition=""
      this.productForm
        .get("condition")
        ?.setValue(this.selectedUsedCondition || "Used");
    }

    console.log("condition value ", this.productForm.get("condition").value);
  }
}
