import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModelLoginComponent } from 'src/app/views/auth/model-login/model-login.component';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent implements OnInit {
  apiUrl = environment.apipath + "/";
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  profileImagePreview: string | null = null;
  selectedProfileImage: File | null = null;
  maxDate: string = new Date().toISOString().split('T')[0];
  saudiArabiaFlagPath = "https://flagcdn.com/w20/sa.png"
  billingForm: FormGroup;

  first_name = new FormControl("",[Validators.minLength(2),Validators.maxLength(50)])
  last_name = new FormControl("",[Validators.minLength(2),Validators.maxLength(50)])
  gender = new FormControl("")
  date_of_birth = new FormControl("", [this.noFutureDateValidator])
  countryCode = new FormControl("KSA")
  phone_number = new FormControl("", [Validators.pattern(/^5\d{8}$/)])
  language = new FormControl("english")
  occupation = new FormControl("", [Validators.minLength(2)])
  about_me = new FormControl("", [Validators.maxLength(300)])
  email = new FormControl("", [Validators.email])
  password = new FormControl("")
  profile_image = new FormControl("")
  // date_of_birth: ["", [this.noFutureDateValidator]],



  billing_address = new FormControl(null, [Validators.maxLength(120)]);
  // first_name = new FormControl([],[Validators.maxLength(50)]);
  // last_name = new FormControl("", [Validators.maxLength(50)]);
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
  cityLists: any;

  getInitialsofUsername(name){
    if (!name) {
      return '';
    }

    const words = name.trim().split(' ');
    console.log("words", words);
    if (words?.length === 1 && words[0] !== "") {
      return words[0][0].toUpperCase();
    } else {
      const emailWord =this.billingForm.get('email').value;
      if(emailWord){
        return emailWord[0][0].toUpperCase();
      }
      // return (emailWord[0][0].toUpperCase());
      // return 'EM';
    }
  }
  getInitials(name: string | undefined | null): string {
    if (!name) {
      return "";
    }
    // Split name by space and get first letters
    const words = name.trim().split(" ");
    // words ['']0: ""length: 1[[Prototype]]: Array(0)

    if (words?.length === 1 && words[0] !== "" && words[0] !== undefined && words[0] !== null ) {
      return words[0][0].toUpperCase();
    } else {
      if(this.billingForm.get('email').value){
        const emailWord = this.billingForm.get('email').value
        if(emailWord[0][0]){
          return emailWord[0][0].toUpperCase();
        }else{
          return
        }
      }
      // return (emailWord[0][0].toUpperCase());
      // return 'EM';
    }
  }
  userID: any;
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
  noFutureDateValidator(control: AbstractControl) {
    if (control.value && new Date(control.value) > new Date()) {
      return { futureDate: true };
    }
    return null;
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  onProfileImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    
    if (selectedDate > today) {
      // Clear the field if future date is selected
      this.billingForm.get('date_of_birth')?.setValue('');
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Future dates are not allowed");
      } else {
        this.alertService.showAlert("warning", "التواريخ المستقبلية غير مسموحة");
      }
    }
  }
  fetchProfiling() {
    this.http.getProfilingInformation().subscribe((res) => {
      const cleanValue = (val: any) => (val === null || val === 'null' ? '' : val);
  
      this.billingForm.patchValue({
        first_name: cleanValue(res.first_name),
        last_name: cleanValue(res.last_name),
        gender: cleanValue(res.gender),
        city: cleanValue(res.city),
        country: cleanValue(res.country) || 'Saudi Arabia',
        date_of_birth: cleanValue(res.date_of_birth),
        phone_number: cleanValue(res.phone_number),
        language: cleanValue(res.language),
        occupation: cleanValue(res.occupation),
        about_me: cleanValue(res.about_me),
        email: cleanValue(res.email),
        profile_image: res?.profile_image ? res.profile_image.replace(/\\/g, "") : '',
        password: cleanValue(res.password),
      });
    });
  }

  ngOnInit(): void {
    this.billingForm = new FormGroup({
      billing_address: this.billing_address,
      street: this.street,
      street_line_2: this.street_line_2,
      zip_code: this.zip_code,
      city: this.city,
      country: this.country,
      state: this.state,
      first_name: this.first_name,
      last_name: this.last_name,
      gender: this.gender,
      date_of_birth: this.date_of_birth,
      countryCode: this.countryCode,
      phone_number: this.phone_number,
      language: this.language,
      occupation: this.occupation,
      about_me: this.about_me,
      email: this.email,
      password: this.password,
      profile_image:this.profile_image
      
    });
    this.getCityLists('Saudi Arabia');

    this.getBillingInformation();
    this.fetchProfiling();
  }

  getCityLists(country) {
    const formData = {
      country: country,
    }
    this.http.getCityLists(formData).subscribe((res) => {
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





  profileFormSubmit() {
    this.billingForm.markAllAsTouched();
    if (this.billingForm.valid) {
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(this.billingForm.value).forEach(key => {
        if (key === 'profile_image') {
          // Sirf tab bhejo jab user ne new image select ki ho
          if (this.selectedProfileImage) {
            formData.append('profile_image', this.selectedProfileImage);
          }
        } else {
          formData.append(key, this.billingForm.get(key).value);
        }
      });

      this.http.saveProfilingInformation(formData).subscribe((res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Profile Update Successfully");
        } else {
          this.alertService.showAlert("success", "تم تحديث الملف الشخصي بنجاح");
        }
        // Reset image selection after successful upload
        this.selectedProfileImage = null;
      });
    } else {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please add form values");
      } else {
        this.alertService.showAlert("warning", "يرجى إضافة قيم النموذج");
      }
    }
  }
}
