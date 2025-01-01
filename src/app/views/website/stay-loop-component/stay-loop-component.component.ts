import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
@Component({
  selector: "app-stay-loop-component",
  templateUrl: "./stay-loop-component.component.html",
  styleUrls: ["./stay-loop-component.component.css"],
})
export class StayLoopComponentComponent implements OnInit {
  watchDetails: any;



  productList=[ 
    { 
      "id": 100,
      "name": "Watch Product dignissimos",
      "title": "Ut molestiae quo necessitatibus eligendi adipisci.",
      "description": "Aspernatur est optio molestiae nobis. Veritatis aliquid aut veritatis nobis necessitatibus deleniti. Quasi quod voluptatibus minus consequatur non numquam ratione dolorum. Ut doloremque et omnis placeat quibusdam molestiae aut temporibus. Unde molestiae sunt culpa error necessitatibus est.",
      "main_image": "products/testing/dummy (28).png",
      "additional_images": "[\"products\/testing\/dummy (11).png\", \"products\/testing\/dummy (6).png\", \"products\/testing\/dummy (32).png\", \"products\/testing\/dummy (40).png\"]",
      "meta_title": "Alias rem alias quasi ipsam enim consequuntur dolorum.",
      "meta_description": "Qui dolorem commodi ipsam aut. Illum repellat excepturi dolorem ipsum eaque.",
      "price": "117.50",
      "currency": "USD"
    },
    { 
      "id": 101,
      "name": "Watch Product dignissimos 2",
      "title": "Ut molestiae quo necessitatibus eligendi adipisci.",
      "description": "Aspernatur est optio molestiae nobis. Veritatis aliquid aut veritatis nobis necessitatibus deleniti. Quasi quod voluptatibus minus consequatur non numquam ratione dolorum. Ut doloremque et omnis placeat quibusdam molestiae aut temporibus. Unde molestiae sunt culpa error necessitatibus est.",
      "main_image": "home/second_slide.png",
      "additional_images": "[\"products\/testing\/dummy (11).png\", \"products\/testing\/dummy (6).png\", \"products\/testing\/dummy (32).png\", \"products\/testing\/dummy (40).png\"]",
      "meta_title": "Alias rem alias quasi ipsam enim consequuntur dolorum.",
      "meta_description": "Qui dolorem commodi ipsam aut. Illum repellat excepturi dolorem ipsum eaque.",
      "price": "717.50",
      "currency": "USD"
    },

    {
      "id": 102, 
      "name": "Watch Product dignissimos 3",
      "title": "Ut molestiae quo necessitatibus eligendi adipisci.",
      "description": "Aspernatur est optio molestiae nobis. Veritatis aliquid aut veritatis nobis necessitatibus deleniti. Quasi quod voluptatibus minus consequatur non numquam ratione dolorum. Ut doloremque et omnis placeat quibusdam molestiae aut temporibus. Unde molestiae sunt culpa error necessitatibus est.",
      "main_image": "home/third_slide.png",
      "additional_images": "[\"products\/testing\/dummy (11).png\", \"products\/testing\/dummy (6).png\", \"products\/testing\/dummy (32).png\", \"products\/testing\/dummy (40).png\"]",
      "meta_title": "Alias rem alias quasi ipsam enim consequuntur dolorum.",
      "meta_description": "Qui dolorem commodi ipsam aut. Illum repellat excepturi dolorem ipsum eaque.",
      "price": "770.50",
      "currency": "USD"
    }

  ]



  ngOnInit(): void {
    this.getWatchOftheDay();
  }

  getWatchOftheDay() {
    this.http.getWatchOfTheDay().subscribe(
      (res) => {
        this.watchDetails=res.data;
        this.watchDetails.map((item:any)=>{
            if(item.banner_img){
              item.banner_img=item.banner_img.replace(/\\/g,"/").replace(/^\/+/,"");
            }
            return item;
        })
      },
      (err) => {
        console.error("Error fetching Watch of the Day:", err);
      }
    );
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
    private router: Router
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  goToProductDetailPage() {
    this.router.navigate(["/buy-product"], {
      state: { data: this.watchDetails.product },
    });
  }
}



