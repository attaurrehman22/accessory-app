import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpService } from "src/services/http/http.service";
import { AddAccessoryCategoryComponent } from "../add-accessory-category/add-accessory-category.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

export interface CategoryData {
  name: any;
  slug: any;
  description: any;
  active: any;
  featured: any;
  order: any;
  meta_title: any;
  meta_description: any;
}

@Component({
  selector: "app-accessory-categories",
  templateUrl: "./accessory-categories.component.html",
  styleUrls: ["./accessory-categories.component.css"],
})
export class AccessoryCategoriesComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "slug",
    "description",
    "active",
    "featured",
    "order",
    "meta_title",
    "meta_description",
    "edit",
  ];
  selectedValue: string;
  dataSource: MatTableDataSource<CategoryData>;
  accessoryCategoryList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpService, private dialog: MatDialog,private alertService:AlertsServicesService) {}

  ngOnInit(): void {
    this.getAllAccessoryCategories();
  }

  getAllAccessoryCategories() {
    this.http.getAdminAccessroiesCategory().subscribe((res) => {
      this.accessoryCategoryList = res.data;
      this.dataSource = new MatTableDataSource(this.accessoryCategoryList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddAccessoryCategoryComponent, {
      width: "1000px",
      height: "auto",
      data: { param: "Create" },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.getAllAccessoryCategories();
      }
    });
  }

  filterCategories() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  editCategory(data) {
     const dialogRef = this.dialog.open(AddAccessoryCategoryComponent, {
      width: "1000px",
      height: "auto",
      data: { param: "Edit",data:data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.getAllAccessoryCategories();
      }
    });
  }

  deleteCategory(data) {
    this.http.deleteAdminAccessroyCategory(data.id).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Product delete successfully')
        this.getAllAccessoryCategories();
      },(err)=>{
        if(err?.error?.message){
          this.alertService.showAlert('warning',err.error.message)
        }else{
          this.alertService.showAlert('warning','Error in deleting Category')
        }
      }
    )
  }
}
