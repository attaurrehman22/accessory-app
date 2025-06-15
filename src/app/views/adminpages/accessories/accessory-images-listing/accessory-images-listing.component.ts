import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { AddAccessoryImagesListingComponent } from '../add-accessory-images-listing/add-accessory-images-listing.component';

export interface ImagesData {
  title_en: any;
  title_ar: any;
  description_en: any;
  description_ar: any;
  image:any;
  action: any;
}

@Component({
  selector: 'app-accessory-images-listing',
  templateUrl: './accessory-images-listing.component.html',
  styleUrls: ['./accessory-images-listing.component.css']
})
export class AccessoryImagesListingComponent implements OnInit{
 apiUrl = environment.apipath+ '/'
  imagesList: ImagesData[] = [];
  dataSource: MatTableDataSource<ImagesData>;
  accessoryCategoryList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpService, private dialog: MatDialog,private alertService:AlertsServicesService){}

  ngOnInit(): void {
    this.getAllImages()
  }

  displayedColumns: string[] = [
    "title_en",
    "title_ar",
    "description_en",
    "description_ar",
    "image",
    "action",
  ];

  getAllImages(){
    this.http.getAllAccessoryImages().subscribe((res)=>{
      this.imagesList = res.map(item => ({
        ...item,
        image: item.image ? item.image.replace(/\\/g, "") : 'No image'
      }));
      this.dataSource = new MatTableDataSource(this.imagesList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    })
  }

  openModal() {
    const dialogRef = this.dialog.open(AddAccessoryImagesListingComponent, {
      width: "1000px",
      height: "auto",
      data: { param: "Create" },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.getAllImages();
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

  editCategory(data) {
    const dialogRef = this.dialog.open(AddAccessoryImagesListingComponent, {
     width: "1000px",
     height: "auto",
     data: { param: "Edit",data:data },
   });

   dialogRef.afterClosed().subscribe((result: any) => {
     if (result == true) {
       this.getAllImages();
     }
   });
 }

 deleteCategory(data) {
   this.http.deleteAccessoryImage(data.id).subscribe(
     (res)=>{
       this.alertService.showAlert('success','Image delete successfully')
       this.getAllImages();
     },(err)=>{
       if(err?.error?.message){
         this.alertService.showAlert('warning',err.error.message)
       }else{
         this.alertService.showAlert('warning','Error in deleting Image')
       }
     }
   )
 }

}
