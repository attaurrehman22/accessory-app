import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-admin-brands-product",
  templateUrl: "./admin-brands-product.component.html",
  styleUrls: ["./admin-brands-product.component.css"],
})
export class AdminBrandsProductComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  data: any;
  paramVal: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: AlertsServicesService,
    private http: HttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: new FormControl("", [Validators.required]),
      slug: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9-]+$"),
      ]),
      description: new FormControl(""),
      cover_image: new FormControl(null),
      is_active: new FormControl(false, [Validators.required]),
      top_brand: new FormControl(false, [Validators.required]),
      meta_title: new FormControl(""),
      meta_description: new FormControl(""),
      meta_keywords: new FormControl(""),
    });
    this.paramVal = history.state.param;
    this.data = history.state.data;
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  fileName:any;

  populateForm(data: any) {
    console.log("Data to populate form", data);
  
    // Convert is_active and top_brand to boolean
    const isActive = data.is_active === 1 ? true : false;
    const isTopBrand = data.top_brand === 1 ? true : false;
    this.fileName = this.data.cover_image;
    // Populate form values
    this.form.patchValue({
      name: data.name,
      slug: data.slug,
      description: data.description,

      is_active: isActive,
      top_brand: isTopBrand,
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      meta_keywords: data.meta_keywords || "",
    });
  }

  // Function to handle file input
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName=this.selectedFile.name;
    }
  }

  save() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append("name", this.form.value.name);
      formData.append("slug", this.form.value.slug);
      formData.append("description", this.form.value.description);
      formData.append("is_active", this.form.value.is_active ? 'true' : 'false');
      formData.append("top_brand", this.form.value.top_brand);

      // If an image is selected, append the image file
      if (this.selectedFile) {
        formData.append("cover_image", this.selectedFile);
      }

      if (this.paramVal === "Edit") {
        this.http.editAdminBrand(formData, this.data.id).subscribe(
          (res) => {
            this.toast.showAlert("success", "Brands Update SuccessFully");
            this.router.navigate(["/admin-brands"]);
          },
          (err) => {
            this.toast.showAlert("danger", "Error Updating Brand");
          }
        );
      } else {
        formData.append("meta_title", this.form.value.meta_title);
        formData.append("meta_description", this.form.value.meta_description);
        formData.append("meta_keywords", this.form.value.meta_keywords);
        this.http.addAdminBrand(formData).subscribe(
          (res) => {
            this.toast.showAlert("success", "Brands Add SuccessFully");
            this.router.navigate(["/admin-brands"]);
          },
          (err) => {
            this.toast.showAlert("danger", "Error Creating Brand");
          }
        );
      }
    }
  }

  cancel() {
    this.dialog.closeAll();
  }
}
