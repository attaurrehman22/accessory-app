import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { Carousel } from 'bootstrap';
import { environment } from "src/environments/environment";
@Component({
  selector: "app-people-syaing-component",
  templateUrl: "./people-syaing-component.component.html",
  styleUrls: ["./people-syaing-component.component.css"],
})
export class PeopleSyaingComponentComponent implements AfterViewInit, OnInit {
   apiUrl = environment.apipath+ '/'
  @ViewChild("testimonialCarousel", { static: false }) carousel!: ElementRef;
  carouselInstance: any;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  activeIndex = 0;
  testimonials:any;

  ngOnInit(): void {
    this.testimonials=[];
    this.getAllStaticstestimonials();
    if(this.testimonials.length == 0 || !this.testimonials){
      this.testimonials = [
            {
              name: 'Suzan B.',
              review_text: `“Items That I ordered were the best investment I ever made. I can't say enough about your quality service."`,
              company_name: 'UI Designer',
              profile_picture: 'assets/images/test-image-3.svg',
              static:true
            },
            {
              name: 'Megen W.',
              review_text: `“Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.”`, // Arabic review
              company_name: 'UI Designer',
              profile_picture: 'assets/images/test-image-2.svg',
              static:true
            },
            {
              name: 'Osama AlRaee',
              review_text: `"You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!"`,
              company_name: 'Entrepreneur',
              profile_picture: 'assets/images/test-image-1.svg',
              static:true
            }
          ];
    }

  }

  async getAllStaticstestimonials() {
    try {
      const res = await firstValueFrom(this.http.getAllStaticstestimonial());
      this.testimonials = res.data.map((testimonial: any) => {
        if (testimonial?.profile_picture) {
          testimonial.profile_picture = testimonial.profile_picture.replace(/\\/g, '');
        }
        return testimonial;
      });

      setTimeout(() => {
        if (this.carousel?.nativeElement) {
          const carouselElement = this.carousel.nativeElement;
          carouselElement.addEventListener("slid.bs.carousel", () => {
            this.updateActiveIndex();
          });
        }
      });
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  }

  

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
      private languageService:LanguageService,
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

  ngAfterViewInit(): void {

      if (this.carousel?.nativeElement) {
      this.carouselInstance = new Carousel(this.carousel.nativeElement, {
        interval: 5000, // 5 seconds
        ride: 'carousel',
        pause: true, // do not stop on hover
        wrap: true, // loop back
      });

      this.carousel.nativeElement.addEventListener("slid.bs.carousel", () => {
        this.updateActiveIndex();
      });
    }
  }

  animationTrigger = false;

  private carouselInitialized = false;

  ngAfterViewChecked(): void {
    if (!this.carouselInitialized && this.carousel?.nativeElement) {
      const carouselElement = this.carousel.nativeElement;
      carouselElement.addEventListener("slid.bs.carousel", () => {
        this.updateActiveIndex();
      });
      this.carouselInitialized = true;
    }
  }

  private updateActiveIndex() {
    const carouselItems =
      this.carousel.nativeElement.querySelectorAll(".carousel-item");
    const activeElement = this.carousel.nativeElement.querySelector(
      ".carousel-item.active"
    );
    this.activeIndex = Array.from(carouselItems).indexOf(activeElement);

    this.animationTrigger = false;
    setTimeout(() => {
      this.animationTrigger = true;
    }, 10); // Small delay to re-trigger CSS animation
    // console.log("this.activeIndex",this.activeIndex)
  }

  getNextIndex(offset: number = 1): number {
    if (!this.testimonials || this.testimonials.length === 0) {
      // console.error('Testimonials not available or empty');
      return 0; // or return a default index, e.g., 0
    }

    return (this.activeIndex + offset + this.testimonials.length) % this.testimonials.length;
  }
}
function firstValueFrom(arg0: any): any {
  throw new Error("Function not implemented.");
}

