import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { AddProductWatchOfTheDayComponent } from '../add-product-watch-of-the-day/add-product-watch-of-the-day.component';
import { Subscription } from 'rxjs';
import { SidebarService } from 'src/services/sidebar.service';

export interface UserData {
  name: any;
  slug: any;
  brand: any;
  cover_image: any;
  created_by: any;
  price: any;
  model: any;
  is_active: any;
  top_brand: any;
  published_date:any;
}

@Component({
  selector: 'app-watch-of-the-day',
  templateUrl: './watch-of-the-day.component.html',
  styleUrls: ['./watch-of-the-day.component.css']
})
export class WatchOfTheDayComponent implements OnInit, OnDestroy {
 displayedColumns: string[] = [
    "name",
    "slug",
    "brand",
    "cover_image",
    "created_by",
    "published_date",
    "price",
    // "model",
    // "is_active",
    // "top_brand",
    "edit",
  ];
  dataSource: MatTableDataSource<UserData>;
  selectedValue: string;
  allData: any;
  sidebarClickSubscription: Subscription;

  userStatu: any = [
    { value: "All", viewValue: "All" },
    { value: false, viewValue: "Blocked user" },
  ];

  currentStatus: any = "All";
  currentPage = 1;
  totalItems = 0;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private http: HttpService,
    private toast: AlertsServicesService,
    private sidebarService: SidebarService
    // private router: Router
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.allUser();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1; // Update current page (Angular uses zero-indexing)
    this.pageSize = event.pageSize; // Update page size
    // this.loadWatchOfTheDayData(this.currentPage, this.pageSize); // Reload data
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Custom filter to check every field
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // You can specify which fields you want to filter on here
      return (
        data.name.toLowerCase().includes(filter) ||
        data.watch_type.toLowerCase().includes(filter) ||
        (data.brand && data.brand.name.toLowerCase().includes(filter)) ||
        (data.created_by && data.created_by.name.toLowerCase().includes(filter)) ||
        (data.price && data.price.toString().includes(filter)) ||
        // (data.model && data.model.toLowerCase().includes(filter)) ||
        // (data.is_active && data.is_active.toString().includes(filter)) ||
        // (data.top_brand && data.top_brand.toString().includes(filter)) ||
        (data.categories && data.categories.some((category: any) => category.name.toLowerCase().includes(filter))) || // Categories
        (data.description && data.description.toLowerCase().includes(filter)) // Description
      );
    };

    // Apply the filter to the dataSource
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openModal() {
         const dialogRef = this.dialog.open(AddProductWatchOfTheDayComponent, {
          width: '1000px',
          height: 'auto',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe(
          (param) => {
          if (param) {
           this.allUser()
          }
        });
  }

  allUser() {
    this.http.watchOfTheDay().subscribe(
      (res) => {
        this.allData = res.data.data;
        this.totalItems = res.data.total;
        this.allData = this.allData.map((product: any) => {
          if (product.banner_img) {
            product.banner_img = product.banner_img
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }
          return product;
        });
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.paginator.pageIndex = this.currentPage - 1; // Set the paginator's current page index

        this.paginator.length = this.totalItems; // Set total item count
      },
      (err) => {}
    );
  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  // deleteProduct(data) {
  //   this.http.deleteAdminProducts(data.id).subscribe(
  //     (res) => {
  //       this.toast.showAlert("success", "Product Delete Susseccfully");
  //       this.allUser();
  //     },
  //     (err) => {
  //       this.toast.showAlert("danger", "Error in removing Product");
  //     }
  //   );
  // }


  activateProduct(data) {
    this.http.activateAdminProducts(data.id).subscribe(
      (res) => {
        if(res.data.is_active===true){
          this.toast.showAlert("success", "Product add to Susseccfully");
        }else{
          this.toast.showAlert("success", "Product De-activate Susseccfully");
        }
        this.allUser();
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

        this.allUser();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in updating top status");
      }
    );
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

  editProduct(data){
    const dialogRef = this.dialog.open(AddProductWatchOfTheDayComponent, {
      width: '1000px',
      height: 'auto',
      disableClose: true,
      data:{ProductDetails:data,param:'Edit'}
    });

    dialogRef.afterClosed().subscribe(
      (param) => {
      if (param) {
       this.allUser()
      }
    });
  }
}
