import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-watch-info',
  templateUrl: './watch-info.component.html',
  styleUrls: ['./watch-info.component.css']
})
export class WatchInfoComponent {
  apiUrl = environment.apipath + "/";
  productDetail: any;
  label: any;
  message: any;
  btnNames: any;
  notifications = true;
  constructor(
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WatchInfoComponent>,
  ) {
    this.productDetail = data.productDetail;
    this.label = data.label;
    this.message = data.message;
    this.btnNames = data.btnNames;

    console.log("productDetail",this.productDetail)
    console.log("label",this.label)
    console.log("message",this.message)
    console.log("btnNames",this.btnNames)
  }


  goToChat(){
    const goToListing = "goToListing"
    this.dialogRef.close(goToListing);
  }


  contactSell(){
    const contact = "contactSell"
    this.dialogRef.close(contact);
  }

  removeFav() {
    const remove = "removeFav"
    this.dialogRef.close(remove);
  }


}
