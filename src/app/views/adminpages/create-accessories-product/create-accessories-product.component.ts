import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatExpansionPanel } from "@angular/material/expansion";
import { NavigationStart, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { LoginStateService } from "src/services/login-service/login-state.service";

interface ColorOption {
  value: string;
  label: string;
  hex: string;
}

@Component({
  selector: "app-create-accessories-product",
  templateUrl: "./create-accessories-product.component.html",
  styleUrls: ["./create-accessories-product.component.css"],
})
export class CreateAccessoriesProductComponent implements OnInit {
  apiUrl = environment.apipath+ '/'
  accessoryForm!: FormGroup;
  showSuccessModal = false;
  uploadedImages: { file: File; preview: string }[] = [];
  mainImage: { file: File; preview: string } | null = null;
  submitting = false;
  displayPriceValue = '$39.99';
  paramValue:any;
  labelMessage:any;
  
  // Define accessory type options
  accessoryTypes = [
    { value: 'strap', label: 'Watch Strap/Band' },
    { value: 'case', label: 'Protective Case' },
    { value: 'screen', label: 'Screen Protector' },
    { value: 'charger', label: 'Charging Dock' },
    { value: 'adapter', label: 'Band Adapter' },
    { value: 'other', label: 'Other Accessories' },
  ];
  // Define watch model options
  watchModels = [
    { value: 'apple_se', label: 'Apple Watch SE' },
    { value: 'apple_series7', label: 'Apple Watch Series 7' },
    { value: 'apple_series8', label: 'Apple Watch Series 8' },
    { value: 'apple_ultra', label: 'Apple Watch Ultra' },
    { value: 'samsung_galaxy4', label: 'Samsung Galaxy Watch 4' },
    { value: 'samsung_galaxy5', label: 'Samsung Galaxy Watch 5' },
    { value: 'fitbit_sense', label: 'Fitbit Sense' },
    { value: 'fitbit_versa', label: 'Fitbit Versa' },
    { value: 'garmin_fenix', label: 'Garmin Fenix' },
    { value: 'other', label: 'Other Models' },
  ];
  // Define warranty options
  warrantyOptions = [
    { value: '', label: 'No warranty' },
    { value: '30days', label: '30 Days' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
  ];
  // Define water resistance options
  waterResistanceOptions = [
    { value: 'none', label: 'Not water resistant' },
    { value: 'splash', label: 'Splash resistant' },
    { value: 'water30m', label: 'Water resistant 30m' },
    { value: 'water50m', label: 'Water resistant 50m' },
    { value: 'water100m', label: 'Water resistant 100m' },
  ];
  // Define color options
  colorOptions: ColorOption[] = [
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'red', label: 'Red', hex: '#EF4444' },
    { value: 'green', label: 'Green', hex: '#10B981' },
    { value: 'pink', label: 'Pink', hex: '#EC4899' },
    { value: 'purple', label: 'Purple', hex: '#8B5CF6' },
    { value: 'gold', label: 'Gold', hex: '#F59E0B' },
  ];
  // Define additional features options
  featureOptions = [
    { id: 'adjustable', label: 'Adjustable Size' },
    { id: 'quickRelease', label: 'Quick Release Mechanism' },
    { id: 'hypoallergenic', label: 'Hypoallergenic' },
    { id: 'antimicrobial', label: 'Antimicrobial Treatment' },
    { id: 'sweatResistant', label: 'Sweat Resistant' },
    { id: 'uvProtection', label: 'UV Protection' },
    { id: 'reflective', label: 'Reflective Elements' },
    { id: 'wirelessCharging', label: 'Wireless Charging Compatible' },
  ];
  constructor(private fb: FormBuilder, private http: HttpClient,private httpService:HttpService,private router:Router,private alertService:AlertsServicesService) {}
  ngOnInit(): void {
    this.getCategories();
    this.initForm();
    if(history?.state?.data){
      this.paramValue = "Edit";
      this.labelMessage = "Edit Accessories Product";
      this.getAccessoriesById(history?.state?.data.id);
    }else{
      this.paramValue = "Create";
      this.labelMessage = "Add Accessories Product";
    }
  }

  getAccessoriesById(ID:any){
    this.httpService.getAccessoriesById(ID).subscribe(
      (res:any)=>{
        this.patchForm(res);
    }
    )
  }

  patchForm(res:any){
    this.accessoryForm.get('name')?.setValue(res.name);
    this.accessoryForm.get('slug')?.setValue(res.slug);
    this.accessoryForm.get('brand')?.setValue(res.brand);
    this.accessoryForm.get('description')?.setValue(res.description);
    this.accessoryForm.get('meta_title')?.setValue(res.meta_title);
    this.accessoryForm.get('meta_description')?.setValue(res.meta_description);
    this.accessoryForm.get('mpn')?.setValue(res.mpn);
    this.accessoryForm.get('model_number')?.setValue(res.model_number);
    this.accessoryForm.get('min_price')?.setValue(res.min_price);
    this.accessoryForm.get('max_price')?.setValue(res.max_price);
    this.accessoryForm.get('has_variant')?.setValue(res.has_variant);
    this.accessoryForm.get('popular_item')?.setValue(res.popular_item);
    this.accessoryForm.get('is_active')?.setValue(res.is_active);
    this.accessoryForm.get('requires_shipping')?.setValue(res.requires_shipping);
    this.accessoryForm.get('views_count')?.setValue(res.views_count);
    this.accessoryForm.get('main_image')?.setValue(res.main_image);
    // this.accessoryForm.get('additional_images')?.setValue(res.additional_images);
    this.mainImage = {
      file: new File([], res.main_image),
      preview: this.apiUrl+ res.main_image.replace(/\\/g, "")
    };
    console.log("res.additional_images",res.additional_images)

    let additionalImages = res.additional_images;
    if (typeof additionalImages === 'string') {
      try {
        // Parse the string into an array
        additionalImages = JSON.parse(additionalImages);
      } catch (error) {
        console.error("Failed to parse additional_images:", error);
        additionalImages = []; // Fallback to an empty array on error
      }
    }

    // Ensure it's an array before mapping
    if (Array.isArray(additionalImages)) {
      this.uploadedImages = additionalImages.map((image: string) => ({
        file: new File([], image),
        preview: this.apiUrl+ image.replace(/\\/g, "")
      }));
    } else {
      this.uploadedImages = [];
    }
    
    this.accessoryForm.get('category_id')?.setValue(res.categories[0].id);
    this.accessoryForm.get('compatibleModels')?.setValue(res.compatible_models);
    this.accessoryForm.get('colors')?.setValue(res.colors);
    this.accessoryForm.get('features')?.setValue(res.features);
    this.accessoryForm.get('accessoryType')?.setValue(res.accessory_type);
    this.accessoryForm.get('material')?.setValue(res.material);
    this.accessoryForm.get('price')?.setValue(res.price);
  }

  categories:any[] = [];

  getCategories(){
    this.httpService.getAdminAccessroiesCategory().subscribe((res:any)=>{
      this.categories = res.data;
    })
  }
  initForm(): void {
    this.accessoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      brand: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      meta_title: ['', Validators.required],
      meta_description: ['', Validators.required],
      mpn: ['', Validators.required],
      model_number: ['', Validators.required],
      category_id: ['', Validators.required],
      min_price: [0, [Validators.required, Validators.min(0)]],
      max_price: [0, [Validators.required, Validators.min(0)]],
      has_variant: [0],
      popular_item: ['no'],
      is_active: [1],
      requires_shipping: [1],
      views_count: [0],
      main_image: [null],
      additional_images: this.fb.array([])
    });
  }
  onSubmit(): void {
    
    if (this.accessoryForm.valid) {
      this.submitting = true;
      
      if(this.paramValue == "Create"){
        // Create case - use FormData for file uploads
        const formData = new FormData();
        
        // Get form values and convert boolean fields to 0/1
        const formValues = this.accessoryForm.value;
        const booleanFields = ['has_variant', 'is_active', 'requires_shipping'];
        
        // Convert boolean fields to 0/1
        booleanFields.forEach(field => {
          formValues[field] = formValues[field] ? 1 : 0;
        });

        // Append all form values to FormData
        Object.keys(formValues).forEach(key => {
          if (key === 'additional_images') {
            // Skip additional_images as we'll handle it separately
            return;
          } else if (key === 'main_image') {
            return;
          } 
           else {
            formData.append(key, formValues[key]);
          }
        });

        // Append main image if exists
        if (this.mainImage) {
          formData.append('main_image', this.mainImage.file);
        }

        // Append additional images
        this.uploadedImages.forEach((image, index) => {
          formData.append('additional_images[]', image.file);
        });

        this.httpService.addAccessory(formData)
          .subscribe({
            next: () => {
              this.router.navigate(['/admin/accessories']);
              this.submitting = false;
            },
            error: (error) => {
              if(error?.error?.errors?.slug){
                this.alertService.showAlert("warning", error.error.errors.slug[0]);
              }
              else if (error?.error?.message) {
                this.alertService.showAlert("warning", error.error.message);
              }
              console.error('Error submitting form:', error);
              this.submitting = false;
              // Add error handling logic here
            }
          });
      } else {
        // Edit case - use bodyData object
        const formValues = this.accessoryForm.value;
        const booleanFields = ['has_variant', 'is_active', 'requires_shipping'];
        
        // Convert boolean fields to 0/1
        booleanFields.forEach(field => {
          formValues[field] = formValues[field] ? 1 : 0;
        });

        // Create bodyData object
        const bodyData = {
          name: formValues.name,
          slug: formValues.slug,
          brand: formValues.brand,
          description: formValues.description,
          meta_title: formValues.meta_title,
          meta_description: formValues.meta_description,
          mpn: formValues.mpn,
          model_number: formValues.model_number,
          category_id: formValues.category_id,
          min_price: formValues.min_price,
          max_price: formValues.max_price,
          has_variant: formValues.has_variant,
          popular_item: formValues.popular_item,
          is_active: formValues.is_active,
          requires_shipping: formValues.requires_shipping,
          views_count: formValues.views_count
        };

        this.httpService.editAccessory(bodyData, history?.state?.data.id)
          .subscribe({
            next: () => {
              this.router.navigate(['/admin/accessories']);
              this.submitting = false;
            },
            error: (error) => {
              console.error('Error updating form:', error);
              this.submitting = false;
              // Add error handling logic here
            }
          });
      }
    } else {
      this.markFormGroupTouched(this.accessoryForm);
    }
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  resetForm(): void {
    this.accessoryForm.reset({
      accessoryType: '',
      material: '',
      brand: '',
      price: 39.99,
      description: '',
      dimensions: '',
      weight: '',
      warranty: '',
      waterResistance: 'none'
    });
    this.getCompatibleModelsArray().clear();
    this.getColorsArray().clear();
    this.getFeaturesArray().clear();
    this.uploadedImages = [];
    this.displayPriceValue = '$39.99';
  }
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.resetForm();
  }
  // Image upload functionality
  handleImageChange(event: any): void {
    // Prevent form submission
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          if (e.target?.result) {
            if (!this.mainImage) {
              this.mainImage = {
                file: file,
                preview: e.target.result
              };
              this.accessoryForm.patchValue({ main_image: file });
            } else {
              this.uploadedImages.push({
                file: file,
                preview: e.target.result
              });
              const additionalImagesArray = this.accessoryForm.get('additional_images') as FormArray;
              additionalImagesArray.push(this.fb.control(file));
            }
          }
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
  }
  
  handleRemoveImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    const additionalImagesArray = this.accessoryForm.get('additional_images') as FormArray;
    additionalImagesArray.removeAt(index);
  }
  
  handleRemoveMainImage(): void {
    this.mainImage = null;
    this.accessoryForm.patchValue({ main_image: null });
  }
  
  openFileSelector(): void {
    // Prevent form submission
    event?.preventDefault();
    event?.stopPropagation();
    
    // You'd typically use ViewChild to get this reference
    // For simplicity in this single-file example, we're using a DOM query
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  // Form array helper methods
  getCompatibleModelsArray(): FormArray {
    return this.accessoryForm.get('compatibleModels') as FormArray;
  }
  getColorsArray(): FormArray {
    return this.accessoryForm.get('colors') as FormArray;
  }
  getFeaturesArray(): FormArray {
    return this.accessoryForm.get('features') as FormArray;
  }
  // Checkbox toggle methods
  onToggleModel(modelValue: string, event: any): void {
    const isChecked = event.target.checked;
    const compatibleModels = this.getCompatibleModelsArray();
    
    if (isChecked) {
      compatibleModels.push(this.fb.control(modelValue));
    } else {
      const index = compatibleModels.value.indexOf(modelValue);
      if (index !== -1) {
        compatibleModels.removeAt(index);
      }
    }
  }
  onToggleColor(colorValue: string, event: any): void {
    const isChecked = event.target.checked;
    const colors = this.getColorsArray();
    
    if (isChecked) {
      colors.push(this.fb.control(colorValue));
    } else {
      const index = colors.value.indexOf(colorValue);
      if (index !== -1) {
        colors.removeAt(index);
      }
    }
  }
  onToggleFeature(featureValue: string, event: any): void {
    const isChecked = event.target.checked;
    const features = this.getFeaturesArray();
    
    if (isChecked) {
      features.push(this.fb.control(featureValue));
    } else {
      const index = features.value.indexOf(featureValue);
      if (index !== -1) {
        features.removeAt(index);
      }
    }
  }
  // Check selection status methods
  isModelSelected(modelValue: string): boolean {
    return this.getCompatibleModelsArray().value.includes(modelValue);
  }
  isColorSelected(colorValue: string): boolean {
    return this.getColorsArray().value.includes(colorValue);
  }
  isFeatureSelected(featureValue: string): boolean {
    return this.getFeaturesArray().value.includes(featureValue);
  }
  // Price slider functionality
  handlePriceChange(event: any): void {
    const newValue = parseFloat(event.target.value);
    this.accessoryForm.patchValue({ price: newValue });
    this.displayPriceValue = `$${newValue.toFixed(2)}`;
  }
}
