import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { AdminAddProductComponent } from "../admin-add-product/admin-add-product.component";
import { Subscription } from "rxjs";
import { SidebarService } from "src/services/sidebar.service";
import { AddEditPromotionComponent } from "../add-edit-promotion/add-edit-promotion.component";
import { ConfirmationModelComponent } from "../../modal/confirmation-model/confirmation-model.component";

export interface UserData {
  name: any;
  slug: any;
  brand: any;
  cover_image: any;
  created_by: any;
  price: any;
  model: any;
  a;
  is_active: any;
  top_brand: any;
  published_date: any;
}

@Component({
  selector: "app-admin-products",
  templateUrl: "./admin-products.component.html",
  styleUrls: ["./admin-products.component.css"],
})
export class AdminProductsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    "name",
    "watch_type",
    "brand",
    "cover_image",
    "created_by",
    "published_date",
    "sale_status",
    "model",
    "is_active",
    "popular_item",

    "isPromoted",
    "isPromoteActive",
    "action",
  ];
  dataSource = new MatTableDataSource<any>();
  resultsLength = 0;
  pageSize = 5;
  pageEvent: PageEvent;
  selectedValue: string;
  allData: any;
  sidebarClickSubscription: Subscription;

  userStatu: any = [
    { value: "All", viewValue: "All" },
    { value: false, viewValue: "Blocked user" },
  ];

  currentStatus: any = "All";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService,
    private toast: AlertsServicesService,
    private route: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      }
    );

    this.getAllCategory();
    this.getPromotionProducts();
    this.getAllBrands();
  }

  productPromotionsList: any[] = [];

  async getPromotionProducts() {
    try {
      const res: any = await this.http.getPromotionProducts().toPromise();
      this.productPromotionsList = res.data.map((prod: any) => ({
        promotion_id: prod.id,
        product_id: prod.product_id,
        promotion_type: prod.promotion_type,
        is_active: prod.is_active,
        promotion_banner: prod.promotion_banner?.replace(/\\/g, ""), // Remove backslashes
        start_date: prod.start_date,
        end_date: prod.end_date,
        discount: prod.discount,
      }));

      console.log("productPromotionsList", this.productPromotionsList);
    } catch (err) {
      console.error("Error fetching promotion products:", err);
    }
  }

  category_ids: any[] = [];
  brand_ids: any[] = [];
  watch_gender: any;
  sort_by: any;
  sort_order: any = "desc";
  name: any;

  brandsList: any;
  categoryList: any;

  async getAllCategory() {
    try {
      // Await the promise returned by the HTTP request
      const res = await this.http.getCategoryDropDown().toPromise();
      this.categoryList = res.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async getAllBrands() {
    try {
      // Wait for the API response
      const res = await this.http.getAllBrandsDropdDown().toPromise();
      this.brandsList = res.data;
    } catch (error) {
      // Log error if something goes wrong with the API request
      console.error("Error fetching brands:", error);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  ClearFilter() {
    this.category_ids = [];
    this.brand_ids = [];
    this.watch_gender = "";
    this.sort_by = "";
    this.sort_order = "desc";
    this.name = "";

    this.loadData();
  }

  async loadData() {
    const page = this.pageEvent ? this.pageEvent.pageIndex + 1 : 1;
    const per_page = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
    const category_ids = this.category_ids;
    const brand_ids = this.brand_ids;
    const watch_gender = this.watch_gender;
    const sortField = this.sort?.active || "";
    const sortDirection = this.sort?.direction || "";

    try {
      const data: any = await this.http
        .getAdminProducts(
          this.name,
          page,
          per_page,
          sortField,
          sortDirection,
          category_ids,
          brand_ids,
          watch_gender,
          this.sort_by,
          this.sort_order
        )
        .toPromise();

      if (data && data.data) {
        // ✅ Format data if needed
        const formattedData = data.data.data.map((product: any) => {
          if (product.main_image) {
            product.main_image = product.main_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }

          // ✅ Find matching promotion by product_id
          const matchedPromotion = this.productPromotionsList.find(
            (promo: any) => promo.product_id == product.id
          );

          if (matchedPromotion) {
            console.log("matchedPromotion", matchedPromotion);
            // ✅ Merge matched promotion details into product
            product.promotion_id = matchedPromotion.promotion_id;
            product.promotion_type = matchedPromotion.promotion_type;
            product.promotio_is_active = matchedPromotion.is_active;
            product.promotion_banner = matchedPromotion.promotion_banner;
            product.start_date = matchedPromotion.start_date;
            product.end_date = matchedPromotion.end_date;
            product.discount = matchedPromotion.discount;

            product.is_promoted =  1;
          }

          return product;
        });

        // ✅ Set DataSource
        this.dataSource.data = formattedData;
        console.log("formattedData", formattedData);
        this.resultsLength = data.data.total;
        // ✅ Bind paginator and sort explicitly after setting the data source
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  // ✅ Handle Page Change
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageEvent = event;
    this.loadData(); // Reload data on page change
  }

  sortData(sort: Sort) {
    this.loadData();
  }

  openModal() {
    this.router.navigate(["/admin-brands-product"], {
      state: { param: "Create" },
    });
  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  deleteProduct(data) {
    this.http.deleteAdminProducts(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Product Delete Susseccfully");
        this.getPromotionProducts();
        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in removing Product");
      }
    );
  }

  activateProduct(data) {
    this.http.activateAdminProducts(data.id).subscribe(
      (res) => {
        if (res.data.is_active === true) {
          this.toast.showAlert("success", "Product add to Susseccfully");
        } else {
          this.toast.showAlert("success", "Product De-activate Susseccfully");
        }
        this.getPromotionProducts();
        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in Updating Active Status");
      }
    );
  }

  addPopularProduct(data) {
    this.http.topAdminPopularProducts(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Product move on top Susseccfully");
        this.getPromotionProducts();
        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in updating top status");
      }
    );
  }

  addFeatureProduct(data) {
    this.http.topFeatureProducts(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Product Add Features Susseccfully");
        this.getPromotionProducts();
        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in Featuring");
      }
    );
  }

  addToPromoteProduct(data) {
    let pro_param = "Create";
    if (data?.is_promoted == 1) {
      // pro_param = "Create";
      pro_param = "Edit";
    } else {
      pro_param = "Create";
    }
    const dialogRef = this.dialog.open(AddEditPromotionComponent, {
      width: "1000px",
      height: "auto",
      data: { param: pro_param, data: data },
    });

    dialogRef.afterClosed().subscribe((param) => {
      if (param) {
        this.getPromotionProducts();
        this.loadData();
        // this.activateProduct(data)
      }
    });
  }

  deletePromoteProduct(row) {
    console.log("promotion_id", row.promotion_id);
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "600px",
      data: {
        message: "Are you sure you want to delete this product from Promotion",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.http.DeletePromotionProducts(row.promotion_id).subscribe(
          (res) => {
            this.toast.showAlert("success", "Product removed successfully");
            this.getPromotionProducts();
            this.loadData();
          },
          (err) => {
            this.toast.showAlert("warning", `${err.error.message}`);
          }
        );
      }
    });
  }

  deleteUser(data: any) {}

  changingStatus(value: any) {
    if (value == "All") {
      this.currentStatus = "All";
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.paginator = this.paginator;
    } else {
      this.currentStatus = false;
      let newData = this.allData.filter((data: any) => {
        return data.isBlocked == true;
      });
      this.dataSource = new MatTableDataSource(newData);
      this.dataSource.paginator = this.paginator;
    }
  }

  download() {
    const option = {
      filename: `User Data`,
      headers: ["User Name", "Name", "Email Address", "Blocked"],
    };

    let newData = [];

    if (this.currentStatus == "All") {
      this.dataSource.filteredData.map((item: any, i: any) => {
        newData[i] = {
          userName: item.userName,
          name: item.name,
          email: item.email,
          status: item.isBlocked,
        };
      });
    } else {
      this.dataSource.filteredData.map((item: any, i: any) => {
        if (item.isBlocked == true) {
          newData.push({
            userName: item.userName,
            name: item.name,
            email: item.email,
            status: item.isBlocked,
          });
        }
      });
    }
  }

  editProduct(data) {
    const dialogRef = this.dialog.open(AdminAddProductComponent, {
      width: "1000px",
      height: "auto",
      data: { param: "Edit", data: data },
    });

    dialogRef.afterClosed().subscribe((param) => {
      if (param) {
        if (param === "approved" || param === "reject") {
          this.activateProduct(data);
        } else {
          this.getPromotionProducts();
          this.loadData();
        }
      }
    });
  }
}
