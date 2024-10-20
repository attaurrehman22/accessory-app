import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-chronosouq-buyer-protection-component",
  templateUrl: "./chronosouq-buyer-protection-component.component.html",
  styleUrls: ["./chronosouq-buyer-protection-component.component.css"],
})
export class ChronosouqBuyerProtectionComponentComponent implements OnInit {
  selectedCategory: any;
  showList: any[] = []; // Store products for the selected category
  categoryNames: any[] = [];
  commentsList: any;

  changeCategory(category: any) {
    this.selectedCategory = category;
 
    this.showList = (category.products || []).map((product: any) => {
      if (product.main_image) {
        product.main_image = product.main_image.replace(/\\/g, ""); // Remove all backslashes
      }
      return product;
    });

    console.log("this.showList", this.showList);

  }
  

  ngOnInit(): void {
    this.getAllTopNewArrivals();

    // if (this.selectedCategory === "all") {
    //   this.showList = this.watches;
    // }
  }

  getAllTopNewArrivals() {
    this.http.getAllTopNewArrivalCategory().subscribe(
      (res) => {
        this.categoryNames = res.data; // Store the entire category data
        this.selectedCategory = this.categoryNames[0]; // Set the first category as default
        this.showList = this.selectedCategory.products || []; // Load products for the default category
      },
      (err) => {}
    );

  }

  constructor(
    public translateService: TranslateService,
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

  toggleHeart(watch): void {
    // this.watches[index].liked = !this.watches[index].liked;
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }
}



























