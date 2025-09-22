import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPriceLimit]',
  standalone: false
})
export class PriceLimitDirective {

  
  private readonly maxLength = 10; // Total max length including decimal
  private readonly decimalPlaces = 2; // Decimal digits allowed

  constructor(
    private el: ElementRef,
    @Optional() private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let value = inputElement.value;

    // Regex: max 8 digits before decimal, max 2 digits after decimal
    const regex = /^(\d{0,8})(\.\d{0,2})?$/;

    if (!regex.test(value)) {
      value = value.slice(0, -1); // remove last invalid char
    }

    // Limit total length
    if (value.length > this.maxLength) {
      value = value.slice(0, this.maxLength);
    }

    // Update input field
    inputElement.value = value;

    // Update ngModel / FormControl bhi
    if (this.control && this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
  }
}
