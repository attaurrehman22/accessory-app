import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-admin-brands-product",
  templateUrl: "./admin-brands-product.component.html",
  styleUrls: ["./admin-brands-product.component.css"],
})
export class AdminBrandsProductComponent {
   apiUrl = environment.apiimagespath;
  form: FormGroup;
  selectedFile: File | null = null;
  selectedSvgFile: File | null = null;
  svgCode: string = '';
  svgFileName: string = '';

  data: any;
  paramVal: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: AlertsServicesService,
    private http: HttpService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AdminBrandsProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.paramVal=data.param;
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
      svg_code: new FormControl("", [Validators.required]),
    });
    if(data?.data){
      this.data=data.data;
      this.populateForm(this.data);
    }
  }

  ngOnInit(): void {
   
  }
  images: string[] = [];

  getAllTopBrands() {
    this.http.getTopBrandsData().subscribe(
      (res) => {
        if (res && res.top_brands) {
          this.images = res.top_brands
            .map((product: any) => {
              if (product?.svg) {
                return this.sanitizer.bypassSecurityTrustHtml(product.svg);
              }
            })
            .filter((img) => img);
            this.updateCombinedImages();
        }
      },
      (err) => {
        console.error('Error loading popular models:', err);
      }
    );
  }

  updateCombinedImages() {
    // Prepend `svgPreview` if it exists
    this.combinedImages = this.svgPreview ? [this.svgPreview, ...this.images] : [...this.images];
  }


  fileName:any;
  svgPreview: SafeHtml | null = null;

  populateForm(data: any) {
    const isActive = data.is_active === 1 ? true : false;
    const isTopBrand = data.top_brand === 1 ? true : false;
    this.previewImage = this.apiUrl + this.data.cover_image;
    this.form.patchValue({
      name: data.name,
      slug: data.slug,
      description: data.description,
      is_active: isActive,
      top_brand: isTopBrand,
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      meta_keywords: data.meta_keywords || "",
      svg_code: data.svg || "",
    });

    if (data.svg) {
      this.svgCode = data.svg;
      this.svgPreview = this.sanitizer.bypassSecurityTrustHtml(this.svgCode);
    }
  }
  combinedImages: SafeHtml[] = [];

  previewImage: string | null = null;
  // Function to handle file input
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSvgFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'image/svg+xml') {
        this.toast.showAlert("danger", "Only SVG files are allowed");
        return;
      }

      this.selectedSvgFile = file;
      this.svgFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;

        if (this.validateSvgCode(content)) {
          this.svgCode = content;
          this.form.patchValue({ svg_code: content });

          // ✅ Display SVG preview
          this.svgPreview = this.sanitizer.bypassSecurityTrustHtml(content);
        } else {
          this.toast.showAlert("danger", "Invalid SVG code");
          this.selectedSvgFile = null;
          this.svgFileName = '';
          this.svgPreview = null;
        }
      };
      reader.readAsText(file);
      this.getAllTopBrands()
    }
  }

    // Validate SVG content
    validateSvgCode(code: string): boolean {
      const parser = new DOMParser();
      const parsedSvg = parser.parseFromString(code, "image/svg+xml");
      return parsedSvg.getElementsByTagName("parsererror").length === 0;
    }

  save() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append("name", this.form.value.name);
      formData.append("slug", this.form.value.slug);
      formData.append("description", this.form.value.description);
      formData.append("is_active", this.form.value.is_active ? 'true' : 'false');
      formData.append("top_brand", this.form.value.top_brand);

      if (this.svgCode) {
        formData.append("svg", this.svgCode);
      }

      // If an image is selected, append the image file
      if (this.selectedFile) {
        formData.append("cover_image", this.selectedFile);
      }

      if (this.paramVal === "Edit") {
        this.http.editAdminBrand(formData, this.data.id).subscribe(
          (res) => {
            this.toast.showAlert("success", "Brands Update SuccessFully");
            // this.router.navigate(["/admin-brands"]);
            this.dialog.closeAll()
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
            // this.router.navigate(["/admin-brands"]);
            this.dialog.closeAll()
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
