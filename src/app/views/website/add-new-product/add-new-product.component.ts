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
  productForm: FormGroup;
  usedCondition: any;
  newCondition: any = "";
  brandsList: any;

  name: FormControl = new FormControl("", Validators.required);
  category_id: FormControl = new FormControl(1, Validators.required);
  title: FormControl = new FormControl("", Validators.required);
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

  case_diameter: FormControl = new FormControl("", Validators.required);
  scope_of_delivery: FormControl = new FormControl("", Validators.required);

  movement: FormControl = new FormControl("", Validators.required);
  meta_description: FormControl = new FormControl("", Validators.required);
  description: FormControl = new FormControl("");
  price: FormControl = new FormControl("", Validators.required);
  currency: FormControl = new FormControl("USD", Validators.required);
  case_material: FormControl = new FormControl("");
  bezel_material: FormControl = new FormControl("");
  water_resistance: FormControl = new FormControl("");
  dial_color: FormControl = new FormControl("");

  bracelet_material: FormControl = new FormControl("");

  commission_fee: FormControl = new FormControl(0);
  // -------------- Extra ---------------------------

  main_image: FormControl = new FormControl("", Validators.required);

  // -------------- Extra End ---------------------------

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private alertService: AlertsServicesService,
    private fb: FormBuilder,
    private http: HttpService,
    public translateService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private languageService:LanguageService
  ) {
    this.translateService.addLangs(this.supportLanguages);

    // Get the saved language from LanguageService
    const savedLang = this.languageService.getCurrentLanguage();

    // Use the saved language or fallback to browser language
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang); // Save browser language if valid
      }
    }
  }

  selectedCondition: string | null = null;
  newUnwarnCondition: string | null = null;

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

  allDropDownList: any = {};

  getAllProductDropDown() {
    this.http.getPrductFormDropDnCategory().subscribe(
      (res) => {
        this.allDropDownList = res.data;
      },
      (err) => {}
    );
  }

  imagePreview: string[] = [];

  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files); // Multiple files are selected

      this.productForm.patchValue({
        additional_images: files, // Store array of files in the form control
      });
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
  topCategories: any; // Categories with top_category: 1
  otherCategories: any;
  getCategoryDropdown() {
    this.http.getCategory().subscribe(
      (response: any) => {
        this.categoryList = response.data;
        this.topCategories = this.categoryList.filter(
          (category) => category.top_category === 1
        );
        this.otherCategories = this.categoryList.filter(
          (category) => category.top_category === 0
        );
      },
      (error: any) => {}
    );
  }

  topBrand: any; // Categories with top_category: 1
  otherBrand: any;

  getBrandsDropdown() {
    this.http.getAllBrands().subscribe(
      (response: any) => {
        this.brandsList = response.data;
        this.topBrand = this.brandsList.filter(
          (brand) => brand.top_brand === 1
        );
        this.otherBrand = this.brandsList.filter(
          (brand) => brand.top_brand === 0
        );
      },
      (error: any) => {}
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
      category_id: this.category_id,
      title: this.title,
      additional_images: this.additional_images,
      watch_type: this.watch_type,
      brand_id: this.brand_id,
      model: this.model,
      main_image: this.main_image,
      meta_description: this.meta_description,
      reference_number: this.reference_number,
      condition: this.condition,
      description: this.description,
      gender: this.gender,
      year_of_production: this.year_of_production,
      case_diameter: this.case_diameter,
      movement: this.movement,
      price: this.price,
      currency: this.currency,
      case_material: this.case_material,
      bezel_material: this.bezel_material,
      water_resistance: this.water_resistance,
      dial_color: this.dial_color,
      bracelet_material: this.bracelet_material,
    });
  }

  img_list: any[];

  loginDialog() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    const token = localStorage.getItem("user_token");
    if (!token) {
      this.loginDialog();
    } else {
      this.productForm.markAllAsTouched();

      const formData: FormData = new FormData();
      Object.keys(this.productForm.controls).forEach((key) => {
        const controlValue = this.productForm.get(key)?.value;
        if (key === "main_image") {
          formData.append(key, controlValue);
        } else if (key === "additional_images") {
          for (let i = 0; i < controlValue.length; i++) {
            formData.append(`${key}[]`, controlValue[i]);
          }
        } else {
          formData.append(key, controlValue ?? "");
        }
      });

      if (this.productForm.valid) {
        this.http.addProduct(formData).subscribe(
          (reponse) => {
            this.router.navigate(["/product-list"]);
          },
          (err) => {
            this.alertService.showAlert("danger", "Error is Add Product");
          }
        );
      } else {
        this.alertService.showAlert("warning", "Form is invalid");
      }
    }
  }

  panelOpenState = false;
  selectedUsedCondition: string | null = null;

  openCondition(param: string) {
    this.selectedCondition = param;
    if (param === "New") {
      this.newCondition = "New";
      this.usedCondition = "";
      this.newUnwarnCondition = "";
      this.productForm.get("condition")?.setValue("New");
    } else if (param === "New-Unwarn") {
      this.newCondition = "";
      this.usedCondition = "";
      this.newUnwarnCondition = "New-Unwarn";
      this.productForm.get("condition")?.setValue("Like new and unworn");
    } else {
      this.usedCondition = "Used";
      this.newCondition = "";
      this.newUnwarnCondition = "";
      this.productForm
        .get("condition")
        ?.setValue(this.selectedUsedCondition || "Used");
    }
  }
}
