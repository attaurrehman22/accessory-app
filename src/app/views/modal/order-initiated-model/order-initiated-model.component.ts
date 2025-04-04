import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-initiated-model',
  templateUrl: './order-initiated-model.component.html',
  styleUrls: ['./order-initiated-model.component.css']
})
export class OrderInitiatedModelComponent {

    label: any;
    paragraph: any;
  
    constructor(
      public dialogRef: MatDialogRef<OrderInitiatedModelComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.label = data?.label;
      this.paragraph = data?.paragraph;
    }

    onOpenChat(){
      this.dialogRef.close( 'openChat');
     
    }

    viewOrder(){
      this.dialogRef.close( 'viewOrder');
    }

}
