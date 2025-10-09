import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent implements OnInit {
  saudiArabiaFlagPath = "https://flagcdn.com/w20/sa.png"
  billingForm: FormGroup;
  billing_address = new FormControl(null, [

    Validators.maxLength(120),
  ]);
  first_name = new FormControl(
    [],
    [Validators.maxLength(50)]
  );
  last_name = new FormControl("", [

    Validators.maxLength(50),
  ]);
  street = new FormControl("", [Validators.maxLength(80)]);
  street_line_2 = new FormControl("", [Validators.maxLength(80)]);
  zip_code = new FormControl("", [

    Validators.pattern("^[0-9]*$"),
    Validators.maxLength(9),
  ]);
  city = new FormControl("", [Validators.maxLength(50)]);
  country = new FormControl({ value: "Saudi Arabia", disabled: true }, [

    Validators.maxLength(50),
  ]);
  state = new FormControl("", [Validators.maxLength(50)]);
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  cityLists: any;
  constructor(
    private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private fb: FormBuilder
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

  ngOnInit(): void {
    this.billingForm = new FormGroup({
      billing_address: this.billing_address,
      first_name: this.first_name,
      last_name: this.last_name,
      street: this.street,
      street_line_2: this.street_line_2,
      zip_code: this.zip_code,
      city: this.city,
      country: this.country,
      state: this.state,
    });
    this.getCityLists('Saudi Arabia');

    this.getBillingInformation();
  }

  getCityLists(country) {
    const formData = {
      country: country,
    }
    this.http.getCityLists(formData).subscribe((res) => {
      // Map each city into an object containing both city and flag
      // this.cityLists = res.data.map((city: string) => ({
      //   name: city,
      //   flag: "https://flagcdn.com/w20/sa.png" // Saudi Arabia flag
      // }));

      this.cityLists= res.data;
    });
    
  }


  dropdownOpen = false;
selectedCity: any = null;

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

selectCity(city: any) {
  this.selectedCity = city;
  this.dropdownOpen = false;
  this.billingForm.get('city')?.setValue(city.name); // keep formControlName working
}


  getBillingInformation() {
    const cleanValue = (val: any) => (val === null || val === 'null' ? '' : val);

    this.http.getBillingInformation().subscribe(
      (res) => {
        const cityName = cleanValue(res.data.city);
        this.billingForm.patchValue({
          first_name: cleanValue(res.data.first_name),
          last_name: cleanValue(res.data.last_name),
          street: cleanValue(res.data.street),
          street_line_2: cleanValue(res.data.street_line_2),
          zip_code: cleanValue(res.data.zip_code),
          city: cityName,
          billing_address: cleanValue(res.data.billing_address),
          country: 'Saudi Arabia',
          state: cleanValue(res?.data?.state),
        });

        if (cityName) {
          const matchedCity = this.cityLists?.find((c: any) => c.name === cityName);
          if (matchedCity) {
            this.selectedCity = matchedCity;
          } else {
            // fallback in case city is not found in cityLists
            this.selectedCity = { name: cityName, flag: "https://flagcdn.com/w20/sa.png" };
          }
        }
      },
      (err) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error in Fetching Billing Information"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء جلب معلومات الفوترة"
          );
        }
      }
    );
  }


  submitBillingForm() {
    if (this.billingForm.invalid) {
      this.alertService.showAlert("warning", "Please fill all the fields");
    } else {
      this.http.saveBillingInformation(this.billingForm.value).subscribe(
        (res) => {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "success",
              "Billing Information Saved Successfully"
            );
          } else {
            this.alertService.showAlert(
              "success",
              "تم حفظ معلومات الفوترة بنجاح"
            );
          }
        },
        (err) => {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert(
              "warning",
              "Error in Saving Billing Information"
            );
          } else {
            this.alertService.showAlert(
              "warning",
              "حدث خطأ أثناء حفظ معلومات الفوترة"
            );
          }
        }
      );
    }
  }
}
