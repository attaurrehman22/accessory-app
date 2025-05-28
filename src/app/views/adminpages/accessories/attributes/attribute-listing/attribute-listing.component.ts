import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { AddAttributeListingComponent } from '../add-attribute-listing/add-attribute-listing.component';

export interface AttributeData {
  name: any;
  type: any;
  action:any;
}

@Component({
  selector: 'app-attribute-listing',
  templateUrl: './attribute-listing.component.html',
  styleUrls: ['./attribute-listing.component.css']
})
export class AttributeListingComponent implements OnInit{

  displayedColumns: string[] = [
    "name",
    "type",
    "action"
  ];

  selectedValue: string;
    dataSource: MatTableDataSource<AttributeData>;
    accessoryCategoryList: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  constructor(private http:HttpService,
    private dialog: MatDialog,
    private alertService:AlertsServicesService
  ){}

  attributesList:any;

  ngOnInit(): void {
      this.getAllAttributes()
  }

  getAllAttributes(){
    this.http.getAttributes().subscribe(
      (res)=>{
        this.attributesList = res;
        this.dataSource = new MatTableDataSource(this.attributesList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

   openModal() {
      const dialogRef = this.dialog.open(AddAttributeListingComponent, {
        width: "1000px",
        height: "auto",
        data: { param: "Create" },
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == true) {
          this.getAllAttributes();
        }
      });
    }

     editCategory(data) {
          const dialogRef = this.dialog.open(AddAttributeListingComponent, {
          width: "1000px",
          height: "auto",
          data: { param: "Edit",data:data },
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result == true) {
            this.getAllAttributes();
          }
        });
      }

      applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   deleteCategory(data) {
    this.http.deleteAttributes(data.id).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Attribute delete successfully')
        this.getAllAttributes();
      },(err)=>{
        if(err?.error?.message){
          this.alertService.showAlert('warning',err.error.message)
        }else{
          this.alertService.showAlert('warning','Error in deleting Attribute')
        }
      }
    )
  }

}
