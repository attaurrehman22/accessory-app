import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-popular-brands-list-alphabetically',
  templateUrl: './popular-brands-list-alphabetically.component.html',
  styleUrls: ['./popular-brands-list-alphabetically.component.css']
})
export class PopularBrandsListAlphabeticallyComponent implements OnInit{

  public brandsData: any[] = [];
  public groupedBrands: { [key: string]: any[] } = {};

  ngOnInit(): void {
      this.getAllBrands();
  }


  constructor(private http:HttpService,private router:Router){}

  brandsList: any;

  getAllBrands() {
    this.http.getAllBrands().subscribe(
      (response) => {
        this.brandsData = response.data;
        this.groupBrandsByAlphabet();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  groupBrandsByAlphabet(): void {
    this.groupedBrands = {};

    // Sort brands by name first
    this.brandsData.sort((a, b) => a.name.localeCompare(b.name));

    // Group by the first letter of the name
    this.brandsData.forEach((brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!this.groupedBrands[firstLetter]) {
        this.groupedBrands[firstLetter] = [];
      }
      this.groupedBrands[firstLetter].push(brand);
    });
  }


  getDetails(brand){
    this.router.navigate(['/product-list'],{
      state:{brandData:brand}
    })
  }
}
