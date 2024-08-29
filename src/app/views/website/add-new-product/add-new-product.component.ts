import { Component, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
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
  selectedCondition: string | null = null;
  brandsList:any;

  name: FormControl = new FormControl("", Validators.required);
  slug: FormControl = new FormControl("", Validators.required);
  image:FormControl = new FormControl(null);
  type: FormControl = new FormControl("", Validators.required);
  brand: FormControl = new FormControl("", Validators.required);
  model: FormControl = new FormControl("", [
    Validators.required,
    Validators.min(0),
  ]);
  referenceNumber: FormControl = new FormControl("", [
    Validators.required,
    Validators.min(1),
  ]);
  condition: FormControl = new FormControl("new", Validators.required);
  gender: FormControl = new FormControl("", Validators.required);
  yearOfProduction: FormControl = new FormControl("", Validators.required);
  approximation: FormControl = new FormControl(false);
  unknown: FormControl = new FormControl(false);
  caseDiameterWidth: FormControl = new FormControl("", Validators.required);
  caseDiameterHeight: FormControl = new FormControl("", Validators.required);
  movement: FormControl = new FormControl("", Validators.required);
  description: FormControl = new FormControl("", Validators.required);
  price: FormControl = new FormControl("", Validators.required);
  currency: FormControl = new FormControl("USD", Validators.required);
  caliberMovement: FormControl = new FormControl("");
  baseCaliber: FormControl = new FormControl("");
  powerReserve: FormControl = new FormControl("");
  numberOfJewels: FormControl = new FormControl("");
  frequency: FormControl = new FormControl("");
  frequencyUnit: FormControl = new FormControl("Ah");
  genevianSeal: FormControl = new FormControl(false);
  chronometer: FormControl = new FormControl(false);
  masterChronometer: FormControl = new FormControl(false);
  caseMaterial: FormControl = new FormControl("");
  bezelMaterial: FormControl = new FormControl("");
  thickness: FormControl = new FormControl("Ah");
  crystal: FormControl = new FormControl("false");
  waterResistance: FormControl = new FormControl("false");
  displayBack: FormControl = new FormControl(false);
  gemstonesDiamonds: FormControl = new FormControl(false);
  pvddlcCoating: FormControl = new FormControl(false);
  dial: FormControl = new FormControl("");
  dialNumerals: FormControl = new FormControl("");
  guillocheDial: FormControl = new FormControl(false);
  guillocheDialHandwork: FormControl = new FormControl(false);
  luminousNumerals: FormControl = new FormControl(false);
  luminousIndices: FormControl = new FormControl(false);
  centralSeconds: FormControl = new FormControl(false);
  smallSeconds: FormControl = new FormControl(false);
  luminousHands: FormControl = new FormControl(false);
  temperedBlueHands: FormControl = new FormControl(false);
  braceletMaterial: FormControl = new FormControl("");
  braceletColor: FormControl = new FormControl("");
  typeOfClasp: FormControl = new FormControl("");
  claspMaterial: FormControl = new FormControl("");

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(private fb: FormBuilder, private http: HttpService,public  translateService: TranslateService) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);
    this.currentLanguage=browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
      
    }
  }

  useLang(lang: string) {
    console.log("Selected Language:", lang);
    this.translateService.use(lang);
    this.translateService.get("header.buy_watch").subscribe((translation) => {
      console.log("Translated Value:", translation);
    });
  }
  
  ngOnInit(): void {
    this.newCondition = "new";
    this.selectedCondition = "new";
    this.createForm();
    this.getBrandsDropdown();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({
        image: file
      });
    }
  }

  getBrandsDropdown() {
    this.http.getAllBrands().subscribe(
      (response: any) => {
        this.brandsList=response.data;
        console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  createForm() {
    this.productForm = this.fb.group({
      name:this.name,
      slug:this.slug,
      image:this.image,
      type: this.type,
      brand: this.brand,
      model: this.model,
      referenceNumber: this.referenceNumber,
      condition: this.condition,
      gender: this.gender,
      yearOfProduction: this.yearOfProduction,
      approximation: this.approximation,
      unknown: this.unknown,
      caseDiameterWidth: this.caseDiameterWidth,
      caseDiameterHeight: this.caseDiameterHeight,
      movement: this.movement,
      description: this.description,
      price: this.price,
      currency: this.currency,
      caliberMovement: this.caliberMovement,
      baseCaliber: this.baseCaliber,
      powerReserve: this.powerReserve,
      numberOfJewels: this.numberOfJewels,
      frequency: this.frequency,
      frequencyUnit: this.frequencyUnit,
      genevianSeal: this.genevianSeal,
      chronometer: this.chronometer,
      masterChronometer: this.masterChronometer,
      caseMaterial: this.caseMaterial,
      bezelMaterial: this.bezelMaterial,
      thickness: this.thickness,
      crystal: this.crystal,
      waterResistance: this.waterResistance,
      displayBack: this.displayBack,
      gemstonesDiamonds: this.gemstonesDiamonds,
      pvddlcCoating: this.pvddlcCoating,
      dial: this.dial,
      dialNumerals: this.dialNumerals,
      guillocheDial: this.guillocheDial,
      guillocheDialHandwork: this.guillocheDialHandwork,
      luminousNumerals: this.luminousNumerals,
      luminousIndices: this.luminousIndices,
      centralSeconds: this.centralSeconds,
      smallSeconds: this.smallSeconds,
      luminousHands: this.luminousHands,
      temperedBlueHands: this.temperedBlueHands,
      braceletMaterial: this.braceletMaterial,
      braceletColor: this.braceletColor,
      typeOfClasp: this.typeOfClasp,
      claspMaterial: this.claspMaterial,
    });
  }

  onSubmit() {
   this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      this.http.addProduct(this.productForm).subscribe((reponse)=>{
        console.log("Data saved")
      })
      // console.log("Product Data:", this.productForm.value);
    } else {
      console.log("Form is invalid", this.productForm.value);
    }
  }

  panelOpenState = false;
  selectedUsedCondition: string | null = null;

  openCondition(param: string) {
    console.log(param);
    this.selectedCondition = param;
    
    if (param === "new") {
      this.newCondition = "new";
      this.usedCondition = "";
      this.productForm.get('condition')?.setValue('new');
    } else {
      this.usedCondition = "used";
      this.newCondition = "";
      this.productForm.get('condition')?.setValue(this.selectedUsedCondition || 'used'); 
    }

    console.log("condition value ", this.productForm.get('condition').value)
  }


  selectUsedCondition(option: string) {
    this.selectedUsedCondition = option;
    this.productForm.get('condition')?.setValue(option);
  }


}
