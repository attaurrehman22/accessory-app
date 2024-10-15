import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-people-syaing-component",
  templateUrl: "./people-syaing-component.component.html",
  styleUrls: ["./people-syaing-component.component.css"],
})
export class PeopleSyaingComponentComponent implements AfterViewInit {
  @ViewChild('testimonialCarousel', { static: false }) carousel!: ElementRef;
  activeIndex = 0; 

  testimonials = [
    {
      name: "Osama AlRaee",
      role: "Entrepreneur",
      image: "../../../../assets/images/osama-alraeeaee.png",
      text: "You won’t regret it. Absolutely wonderful product!",
      rating: "⭐⭐⭐⭐⭐",
    },
    // {
    //   name: "Megen W.",
    //   role: "UI Designer",
    //   image: "../../../../assets/images/megen-w.png",
    //   text: "You won’t regret it. Absolutely wonderful product!",
    //   rating: "⭐⭐⭐⭐⭐",
    // },
    // {
    //   name: "Suzan B.",
    //   role: "UI Designer",
    //   image: "../../../../assets/images/suzan-b.png",
    //   text: "You won’t regret it. Absolutely wonderful product!",
    //   rating: "⭐⭐⭐⭐⭐",
    // }
  ];

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  ngAfterViewInit(): void {
    const carouselElement = this.carousel.nativeElement;
    carouselElement.addEventListener('slid.bs.carousel', () => {
      this.updateActiveIndex();
    });
  }

  private updateActiveIndex() {
    const carouselItems = this.carousel.nativeElement.querySelectorAll('.carousel-item');
    const activeElement = this.carousel.nativeElement.querySelector('.carousel-item.active');
    this.activeIndex = Array.from(carouselItems).indexOf(activeElement);
  }

  getNextIndex() {
    return (this.activeIndex + 1) % this.testimonials.length;
  }


}
