import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatExpansionPanel } from "@angular/material/expansion";
import { NavigationStart, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
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
  accessoryForm!: FormGroup;
  showSuccessModal = false;
  uploadedImages: string[] = [];
  submitting = false;
  displayPriceValue = '$39.99';
  
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
  constructor(private fb: FormBuilder, private http: HttpClient) {}
  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.accessoryForm = this.fb.group({
      accessoryType: ['', Validators.required],
      compatibleModels: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      material: ['', Validators.required],
      brand: ['', Validators.required],
      colors: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      price: [39.99, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      dimensions: [''],
      weight: [''],
      warranty: [''],
      waterResistance: ['none'],
      features: this.fb.array([])
    });
  }
  onSubmit(): void {
    if (this.accessoryForm.valid) {
      this.submitting = true;
      this.http.post('/api/accessories', this.accessoryForm.value)
        .subscribe({
          next: () => {
            this.showSuccessModal = true;
            this.submitting = false;
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            this.submitting = false;
            // Add error handling logic here
          }
        });
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
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    const remainingFiles = files.length;
    let processedFiles = 0;
    
    Array.from(files).forEach((file: any) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          if (e.target?.result) {
            newImages.push(e.target.result);
          }
          
          processedFiles++;
          if (processedFiles === remainingFiles) {
            this.uploadedImages = [...this.uploadedImages, ...newImages];
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        processedFiles++;
      }
    });
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
  }
  
  handleRemoveImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }
  
  openFileSelector(): void {
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
