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

        const toArray = (data: any) =>
          Array.isArray(data) ? data : data ? [data] : [];
  
        const buyOrders = toArray(res?.data?.buy_order).map((order: any) => ({
          title: 'Buy Orders',
          image: order?.product?.main_image ?  order?.product?.main_image.replace(/\\/g, "") : '',
          itemTitle: order?.product?.title || 'N/A',
          itemDesc: `Order ID ${order?.order_id || 'N/A'} | ${this.timeAgo(order?.created_at)}`,
          status: this.mapStatus(order?.status)
        }));
  
        const sellOrders = toArray(res?.data?.sell_order).map((order: any) => ({
          title: 'Sell Orders', 
          image: order?.product?.main_image ?  order?.product?.main_image.replace(/\\/g, "") : '',
          itemTitle: order?.product?.title || 'N/A',
          itemDesc: `Order ID ${order?.order_id || 'N/A'} | ${this.timeAgo(order?.created_at)}`,
          status: this.mapStatus(order?.status)
        }));
  
        const myListings = toArray(res?.data?.my_listing).map((listing: any) => ({
          title: 'My Listings',
          image: listing?.main_image ?  listing?.main_image.replace(/\\/g, "") : '',
          itemTitle: listing?.title || 'N/A',
          itemDesc: `Listing ID ${listing?.id || 'N/A'} | ${this.timeAgo(listing?.created_at)}`,
          status: listing?.sale_status === 'for_sale' ? 'Active' : 'Inactive'
        }));
  
        const favorites = toArray(res?.data?.favorite).map((fav: any) => ({
          title: 'Favorites',
          image: fav?.product?.main_image ?  fav?.product?.main_image.replace(/\\/g, "") : '',
          itemTitle: `${fav?.product?.brand?.name || ''} | ${fav?.product?.model || ''}`,
          itemDesc: 'Available At An Unbeatable Price, This Watch Is In Excellent Condition!',
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

    if (days > 7) return `${Math.floor(days / 7)} week ago`;
    if (days >= 1) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  mapStatus(status: string): string {
    switch (status) {
      case 'initiated':
        return 'Order Confirmation';
      case 'pending_payment':
        return 'Pending Payment';
      case 'completed':
        return 'Completed';
      default:
        return status || '';
    }
  }
  
  sections:any = [  ];

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
