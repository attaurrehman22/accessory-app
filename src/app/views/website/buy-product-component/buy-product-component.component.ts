import { Component, OnInit } from "@angular/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-buy-product-component",
  templateUrl: "./buy-product-component.component.html",
  styleUrls: ["./buy-product-component.component.css"],
})
export class BuyProductComponentComponent implements OnInit {

  productsList:any;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.http.getProducts().subscribe(
      (res) => {
        this.productsList=res.data;
      },
      (err) => {
        console.log(err)
      }
    );
  }
}
