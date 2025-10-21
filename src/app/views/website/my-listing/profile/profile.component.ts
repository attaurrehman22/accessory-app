import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModelLoginComponent } from 'src/app/views/auth/model-login/model-login.component';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileForm!: FormGroup;
  apiUrl = environment.apipath + "/";
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  notifications = true;
  newsletter = false;

  ngOnInit(): void {
    this.fetchProfiling();
    this.getSummary()
  }

  getSummary(){
    this.http.getSummary().subscribe(
      (res)=>{
        console.log("RES",res)
      }
    )
  }

  profile:any;
  email:any;
  phone:any;
  city:any;
  fetchProfiling() {
    this.http.getProfilingInformation().subscribe((res) => {
      const cleanValue = (val: any) => (val === null || val === 'null' ? '' : val);
      this.profile = res?.profile_image ? res.profile_image.replace(/\\/g, "") : '';
      this.email = res?.email;
      this.phone = res?.phone_number;
      this.city = res?.city;

      // this.profileForm.patchValue({
      //   first_name: cleanValue(res.first_name),
      //   last_name: cleanValue(res.last_name),
      //   gender: cleanValue(res.gender),
      //   city: cleanValue(res.city),
      //   country: cleanValue(res.country) || 'Saudi Arabia',
      //   date_of_birth: cleanValue(res.date_of_birth),
      //   phone_number: cleanValue(res.phone_number),
      //   language: cleanValue(res.language),
      //   occupation: cleanValue(res.occupation),
      //   about_me: cleanValue(res.about_me),
      //   email: cleanValue(res.email),
      //   profile_image: res?.profile_image ? res.profile_image.replace(/\\/g, "") : '',
      //   password: cleanValue(res.password),
      // });
    });
  }
  
  sections = [
    {
      title: 'Buy Orders',
      itemTitle: 'Rolex Speedmaster In A Good Condition But In Low Price',
      itemDesc: 'Order ID 334566454562 | 1 day ago',
      status: 'Order Confirmation'
    },
    {
      title: 'Sell Orders',
      itemTitle: 'Rolex Speedmaster In A Good Condition But In Low Price',
      itemDesc: 'Order ID 334566454562 | 1 day ago',
      status: 'Pending Payment'
    },
    {
      title: 'My Listings',
      itemTitle: 'Rolex Speedmaster In A Good Condition But In Low Price',
      itemDesc: 'Listing ID 334566454562 | 1 week ago',
      status: 'Active'
    },
    {
      title: 'Favorites',
      itemTitle: 'Rolex | Speed Master II',
      itemDesc: 'Available At An Unbeatable Price, This Watch Is In Excellent Condition!',
      status: ''
    }
  ];

  viewAllFor(section){
    console.log("Section",section)
    if(section.title == 'Buy Orders'){
      this.router.navigate(['myListing/buy/order'])
    }else if(section.title == 'Sell Orders'){
      this.router.navigate(['myListing/sell/order'])
    }
    else if(section.title == 'My Listings'){
      this.router.navigate(['myListing/listing'])
    }else if(section.title == 'Favorites'){
      this.router.navigate(['myListing/favorite'])
    }
  }

  constructor(private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private fb: FormBuilder){
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

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  toggleLang() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
  }
}
