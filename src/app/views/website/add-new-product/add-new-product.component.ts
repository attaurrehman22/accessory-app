import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.component.html",
  styleUrls: ["./add-new-product.component.css"],
})

export class AddNewProductComponent implements OnInit{
  productForm: FormGroup;
  usedCondition: any;
  newCondition: any = '';
  selectedCondition: string | null = null;
  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      type: ["", Validators.required],
      brand: ["", Validators.required],
      model: ["", [Validators.required, Validators.min(0)]],
      referenceNumber: ["", [Validators.required, Validators.min(1)]],
      condition: ["", Validators.required],
      gender: [''],
      yearOfProduction: [''],
      approximation: [false],
      unknown: [false],
      caseDiameterWidth: [''],
      caseDiameterHeight: [''],
      movement: [''],
      description: [''],
      price: [''],
      currency: ['USD'],
      caliberMovement: [''],
      baseCaliber: [''],
      powerReserve: [''],
      numberOfJewels: [''],
      frequency: [''],
      frequencyUnit: ['Ah'],
      genevianSeal: [false],
      chronometer: [false],
      masterChronometer: [false],

      caseMaterial: [''],
      bezelMaterial: [''],
      thickness: ['Ah'],
      crystal: ['false'],
      waterResistance: ['false'],
      displayBack: [false],
      gemstonesDiamonds: [false],
      pvddlcCoating: [false],

      dial: [''],
      dialNumerals: [''],
      guillocheDial: [false],
      guillocheDialHandwork: [false],
      luminousNumerals: [false],
      luminousIndices: [false],
      centralSeconds: [false],
      smallSeconds: [false],
      luminousHands: [false],
      temperedBlueHands: [false],

      braceletMaterial: [''],
      braceletColor: [''],
      typeOfClasp: [''],
      claspMaterial: [''],

    });
  }

  ngOnInit(): void {
      this.newCondition='new';
      this.selectedCondition='new'
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log("Product Data:", this.productForm.value);
      // yahan aap service ko call kar sakte hain jab wo bana li jaye
    } else {
      console.log("Form is invalid");
    }
  }

  panelOpenState = false;

  openCondition(param: string) {
    console.log(param)
    this.selectedCondition = param;
    if (param === 'new') {
      this.newCondition = 'new';
      this.usedCondition = '';
    } else {
      this.usedCondition = 'used';
      this.newCondition = '';
    }
  }
}
