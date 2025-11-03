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
  profile:any;
  email:any;
  phone:any;
  city:any;
  isLoading: boolean = true;
userName:any;
  ngOnInit(): void {
    this.getSummary()
  }

  getSummary(){
    this.isLoading=true
    this.http.getSummary().subscribe(
      (res) => {
        console.log("API Response:", res);
        this.profile = res?.data?.profile?.profile_image ? res?.data?.profile?.profile_image.replace(/\\/g, "") : '';
        this.email = res?.data?.profile?.email;
        this.phone = res?.data?.profile?.phone_number;
        this.city = res?.data?.profile?.city;
        if(res?.data?.profile?.first_name ){
          this.userName =  res?.data?.profile?.first_name + ' ' + res?.data?.profile?.last_name
        }

        const toArray = (data: any) =>
          Array.isArray(data) ? data : data ? [data] : [];
  
        const buyOrders = toArray(res?.data?.buy_order).map((order: any) => ({
          id: order?.id,
          titleKey: 'profile.buy_orders',
          image: order?.product?.main_image ?  order?.product?.main_image.replace(/\\/g, "") : '',
          itemTitle: order?.product?.title || 'N/A',
          itemDesc: `${this.translateService.instant('profile.order_id')} ${order?.order_id || 'N/A'} | ${this.timeAgo(order?.created_at)}`,
          status: this.mapStatus(order?.status)
        }));
  
        const sellOrders = toArray(res?.data?.sell_order).map((order: any) => ({
          id: order?.id,
          titleKey: 'profile.sell_orders', 
          image: order?.product?.main_image ?  order?.product?.main_image.replace(/\\/g, "") : '',
          itemTitle: order?.product?.title || 'N/A',
          itemDesc: `${this.translateService.instant('profile.order_id')} ${order?.order_id || 'N/A'} | ${this.timeAgo(order?.created_at)}`,
          status: this.mapStatus(order?.status)
        }));
  
        const myListings = toArray(res?.data?.my_listing).map((listing: any) => ({
          id: listing?.id,
          titleKey: 'profile.my_listings',
          image: listing?.main_image ?  listing?.main_image.replace(/\\/g, "") : '',
          itemTitle: listing?.title || 'N/A',
          itemDesc: `${this.translateService.instant('profile.listing_id')} ${listing?.id || 'N/A'} | ${this.timeAgo(listing?.created_at)}`,
          status: listing?.sale_status === 'for_sale' ? this.translateService.instant('profile.active') : this.translateService.instant('profile.inactive')
        }));
  
        const favorites = toArray(res?.data?.favorite).map((fav: any) => ({
          titleKey: 'profile.favorites',
          image: fav?.product?.main_image ?  fav?.product?.main_image.replace(/\\/g, "") : '',
          itemTitle: `${fav?.product?.brand?.name || ''} | ${fav?.product?.model || ''}`,
          itemDesc: this.translateService.instant('profile.favorite_description'),
          status: ''
        }));
  
        // ✅ Final structured list
        this.sections = [...buyOrders, ...sellOrders, ...myListings, ...favorites];
        this.isLoading=false;
        console.log("this.sections:", this.sections);
      }
      
    )
  }


  timeAgo(dateString: string): string {
    if (!dateString) return '';
    const diff = Date.now() - new Date(dateString).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? this.translateService.instant('profile.week_ago', { weeks }) : this.translateService.instant('profile.weeks_ago', { weeks });
    }
    if (days >= 1) {
      return days === 1 ? this.translateService.instant('profile.day_ago', { days }) : this.translateService.instant('profile.days_ago', { days });
    }
    if (hours >= 1) {
      return hours === 1 ? this.translateService.instant('profile.hour_ago', { hours }) : this.translateService.instant('profile.hours_ago', { hours });
    }
    if (minutes >= 1) {
      return minutes === 1 ? this.translateService.instant('profile.minute_ago', { minutes }) : this.translateService.instant('profile.minutes_ago', { minutes });
    }
    return this.translateService.instant('profile.just_now');
  }

  mapStatus(status: string): string {
    // change the status to the translation
    switch (status) {
      case 'initiated':
        return this.translateService.instant('profile.order_confirmation');
      case 'pending_payment':
        return this.translateService.instant('profile.pending_payment');
      case 'completed':
        return this.translateService.instant('profile.completed');
    }
    return this.translateService.instant('profile.order_confirmation');
  }
  
  sections:any = [  ];

  viewAllFor(section){
    console.log("Section",section)
    const buyOrdersKey = 'profile.buy_orders';
    const sellOrdersKey = 'profile.sell_orders';
    const myListingsKey = 'profile.my_listings';
    const favoritesKey = 'profile.favorites';
    const key = section.titleKey;

    if(key == buyOrdersKey){
      this.router.navigate(['myListing/buy/order'])
    }else if(key == sellOrdersKey){
      this.router.navigate(['myListing/sell/order'])
    }
    else if(key == myListingsKey){
      // this.router.navigate(["/new-product"], {
      //   state: { productID: section.id },
      // });
      this.router.navigate(['/myListing/listing'])
    }else if(key == favoritesKey){
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

  goToDetails(section){
    const buyOrdersKey = 'profile.buy_orders';
    const sellOrdersKey = 'profile.sell_orders';
    const myListingsKey = 'profile.my_listings';
    const favoritesKey = 'profile.favorites';
    const key = section.titleKey;

    if(key == buyOrdersKey){
      this.router.navigate(['/myListing/buy/order/details'], { queryParams: { id: section.id } });
    }else if(key == sellOrdersKey){
      this.router.navigate(['/myListing/sell/order/details'], { queryParams: { id: section.id } });
    }
    else if(key == myListingsKey){
      this.router.navigate(["/new-product"], {
        state: { productID: section.id },
      });
    }else if(key == favoritesKey){
      this.router.navigate(['myListing/favorite'])
    }
  }

  toggleLang() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
  }
}
