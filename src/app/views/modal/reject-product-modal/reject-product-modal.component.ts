import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-reject-product-modal",
  templateUrl: "./reject-product-modal.component.html",
  styleUrls: ["./reject-product-modal.component.css"],
})
export class RejectProductModalComponent {
  product:any;
  comment: string = "";

  constructor(private http:HttpService,
    public dialogRef: MatDialogRef<RejectProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.product = data.data;
    console.log("id of data",data.data.id)
  }

  rejectProduct(commentModel: any) {



    if (commentModel.invalid) {
      commentModel.control.markAsTouched(); // Mark it touched to show error
      return;
    }
  

    if (!this.comment || this.comment.length < 15) {
      alert("Please provide a reason of at least 15 characters.");
      return;
    }
    

    const rejectionData = {
      rejection_notes: this.comment
    };
  
    this.http.rejectProduct(this.product.id, rejectionData).subscribe(
      (res) => {
        console.log("Product rejected successfully:", res);
        this.dialogRef.close(true);
      }
    );
  }
  

  cancel() {
    this.dialogRef.close(false); // Close the dialog without any action
  }
}
