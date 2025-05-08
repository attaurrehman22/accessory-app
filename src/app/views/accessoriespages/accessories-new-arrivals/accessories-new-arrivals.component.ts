import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-accessories-new-arrivals',
  templateUrl: './accessories-new-arrivals.component.html',
  styleUrls: ['./accessories-new-arrivals.component.css']
})
export class AccessoriesNewArrivalsComponent implements OnInit{

  showList: any;

  constructor(private http: HttpService, private router: Router) {}

  
  ngOnInit(): void {
    this.getProductsofnewArrivals();
  }

  getProductsofnewArrivals() {
    let queryString = "";

    this.http.getProductsByCategory(queryString).subscribe((res) => {
      this.showList = res;
      this.showList = this.showList?.data?.data;
      this.showList?.data?.data?.map((product: any) => {
        if (product.main_image) {
          product.main_image = product.main_image
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.folder) {
          product.folder = product.folder
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.additional_images) {
          try {
            product.additional_images = JSON.parse(
              product.additional_images
            ).map((img: string) => img.replace(/\\/g, "/").replace(/^\/+/, ""));
          } catch (error) {
            console.error("Error parsing additional_images:", error);
          }
        }
        return product;
      });
    });
  }

}
