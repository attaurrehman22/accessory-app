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

interface Active {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: "app-admin-category-product",
  templateUrl: "./admin-category-product.component.html",
  styleUrls: ["./admin-category-product.component.css"],
})
export class AdminCategoryProductComponent {
  form: any;
  isDisplayed = true;
  submitted = false;
  paramval: any = "";
  userStatus: string = "";

  selectedValue: string;

  data: any;

  createForm() {
    this.form = this.fb.group({
      name: new FormControl("", [Validators.required]),
      slug: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9-]+$"),
      ]),
      parent_id: new FormControl(),
      description: new FormControl(""),
      cover_image: new FormControl(null),
      meta_title: new FormControl(""),
      meta_description: new FormControl(""),
      is_active: new FormControl(false, [Validators.required]),
      meta_keywords: new FormControl(""),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = this.selectedFile.name;
    }
  }

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private http: HttpService,
    private router: Router,
    private toast: AlertsServicesService
  ) {}
  ngOnInit(): void {
    this.paramval = history.state.param;

    this.createForm();

    this.data = history.state.data;
    if (this.data) {
      this.populateForm(this.data);
    }
  }

  selectedFile: File | null = null;
  fileName: any;

  populateForm(data: any) {
    console.log("Data to populate form", data);
    const isActive = data.is_active === 1 ? true : false;
    this.fileName = this.data.cover_image;
    this.form.patchValue({
      name: data.name,
      slug: data.slug,
      description: data.description,
      parent_id: data.parent_id,
      is_active: isActive,
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      meta_keywords: data.meta_keywords || "",
    });
  }

  save() {
    if (this.form.invalid) {
      this.toast.showAlert(
        "danger",
        "Please fill all required fields correctly."
      );
      return;
    }

    const formData = new FormData();

    formData.append("name", this.form.value.name);
    formData.append("slug", this.form.value.slug);
    formData.append("description", this.form.value.description);
    formData.append("parent_id", this.form.value.parent_id || null); // Handle null parent_id
    formData.append("is_active", this.form.value.is_active ? "true" : "false"); // Send as string

    if (this.form.value.meta_title) {
      formData.append("meta_title", this.form.value.meta_title);
    }
    if (this.form.value.meta_description) {
      formData.append("meta_description", this.form.value.meta_description);
    }
    if (this.form.value.meta_keywords) {
      formData.append("meta_keywords", this.form.value.meta_keywords);
    }

    if (this.selectedFile) {
      formData.append("cover_image", this.selectedFile);
    }

    const formDataEntries: any = {};
    formData.forEach((value, key) => {
      formDataEntries[key] = value;
    });
    console.log(formDataEntries);

    if (this.paramval === "Create") {
      this.http.addAdminCategory(formData).subscribe(
        (res) => {
          this.toast.showAlert("success", "Category added successfully.");
          this.router.navigate(["/admin-category"]);
        },
        (err) => {
          this.toast.showAlert(
            "danger",
            "Error creating category. Please try again."
          );
        }
      );
    } else {
      this.http.editAdminCategory(formData, this.data.id).subscribe(
        (res) => {
          this.toast.showAlert("success", "Category Update successfully.");
          this.router.navigate(["/admin-category"]);
        },
        (err) => {
          this.toast.showAlert(
            "danger",
            "Error Updating category. Please try again."
          );
        }
      );
    }
  }

  cancel() {
    this.router.navigate(["/admin-category"]);
  }
}
