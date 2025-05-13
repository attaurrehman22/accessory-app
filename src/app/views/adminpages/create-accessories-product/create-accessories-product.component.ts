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

export interface Brand {
  name: string;
  id: any;
}

export interface Category {
  name: string;
  id: any;
}

interface ImageFile {
  file: File;
  url: string;
  isUploading: boolean;
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
            // Add error handling logic here (e.g., toast notification)
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
  }
  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.resetForm();
  }
  onImagesChange(images: string[]): void {
    this.uploadedImages = images;
  }
  onToggleModel(modelValue: string, isChecked: boolean): void {
    const compatibleModels = this.getCompatibleModelsArray();
    if (isChecked) {
      compatibleModels.push(this.fb.control(modelValue));
    } else {
      const index = compatibleModels.controls.findIndex(control => control.value === modelValue);
      if (index !== -1) {
        compatibleModels.removeAt(index);
      }
    }
  }
  onToggleFeature(featureValue: string, isChecked: boolean): void {
    const features = this.getFeaturesArray();
    if (isChecked) {
      features.push(this.fb.control(featureValue));
    } else {
      const index = features.controls.findIndex(control => control.value === featureValue);
      if (index !== -1) {
        features.removeAt(index);
      }
    }
  }
  isModelSelected(modelValue: string): boolean {
    return this.getCompatibleModelsArray().controls.some(control => control.value === modelValue);
  }
  isFeatureSelected(featureValue: string): boolean {
    return this.getFeaturesArray().controls.some(control => control.value === featureValue);
  }
  getCompatibleModelsArray(): FormArray {
    return this.accessoryForm.get('compatibleModels') as FormArray;
  }
  getColorsArray(): FormArray {
    return this.accessoryForm.get('colors') as FormArray;
  }
  getFeaturesArray(): FormArray {
    return this.accessoryForm.get('features') as FormArray;
  }
  onColorsChange(colors: string[]): void {
    const colorsArray = this.getColorsArray();
    colorsArray.clear();
    colors.forEach(color => colorsArray.push(this.fb.control(color)));
  }
  onPriceChange(price: number): void {
    this.accessoryForm.patchValue({ price });
  }

    @Input() selectedColors: string[] = [];
    @Output() onChange = new EventEmitter<string[]>();

    colorOptions = [
    { value: 'black', label: 'Black', hex: '#000000' },
    { value: 'white', label: 'White', hex: '#FFFFFF' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'red', label: 'Red', hex: '#EF4444' },
    { value: 'green', label: 'Green', hex: '#10B981' },
    { value: 'pink', label: 'Pink', hex: '#EC4899' },
    { value: 'purple', label: 'Purple', hex: '#8B5CF6' },
    { value: 'gold', label: 'Gold', hex: '#F59E0B' },
  ];

   toggleColor(colorValue: string): void {
    let newColors: string[];
    
    if (this.selectedColors.includes(colorValue)) {
      newColors = this.selectedColors.filter(c => c !== colorValue);
    } else {
      newColors = [...this.selectedColors, colorValue];
    }
    
    this.onChange.emit(newColors);
  }



   @Input() value: number = 39.99;
  // @Output() onChange = new EventEmitter<number>();
  
  displayValue: string = '';
  
  ngOnChanges(): void {
    this.updateDisplayValue();
  }
  
  handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = parseFloat(input.value);
    // this.onChange.emit(newValue);
    this.value = newValue;
    this.updateDisplayValue();
  }
  
  private updateDisplayValue(): void {
    this.displayValue = `$${this.value.toFixed(2)}`;
  }



   @Input() images: string[] = [];
  // @Output() onImagesChange = new EventEmitter<string[]>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }
  
  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    
    if (!files || files.length === 0) return;
    
    const newImages: string[] = [];
    const remainingFiles = files.length;
    let processedFiles = 0;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
          }
          
          processedFiles++;
          if (processedFiles === remainingFiles) {
            // this.onImagesChange.emit([...this.images, ...newImages]);
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        processedFiles++;
      }
    });
    
    // Reset the input so the same file can be selected again
    input.value = '';
  }
  
  handleRemoveImage(index: number): void {
    const newImages = [...this.images];
    newImages.splice(index, 1);
    // this.onImagesChange.emit(newImages);
  }
}
