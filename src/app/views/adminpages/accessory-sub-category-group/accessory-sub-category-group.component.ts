import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { AddAccessorySubCategoryGroupComponent } from '../add-accessory-sub-category-group/add-accessory-sub-category-group.component';


export interface CategoryData {
  name: any;
  slug: any;
  description: any;
  active: any;
  order: any;
  meta_title: any;
  meta_description: any;
}


@Component({
  selector: 'app-accessory-sub-category-group',
  templateUrl: './accessory-sub-category-group.component.html',
  styleUrls: ['./accessory-sub-category-group.component.css']
})
export class AccessorySubCategoryGroupComponent {

    displayedColumns: string[] = [
    "name",
    "slug",
    "description",
    "active",
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
    this.http.getAdminAccessroiesSubCategoryGroups().subscribe((res) => {
      this.accessoryCategoryList = res.data;
      this.dataSource = new MatTableDataSource(this.accessoryCategoryList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddAccessorySubCategoryGroupComponent, {
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
     const dialogRef = this.dialog.open(AddAccessorySubCategoryGroupComponent, {
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
    this.http.deleteAdminAccessroiesSubCategoryGroups(data.id).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Category delete successfully')
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
