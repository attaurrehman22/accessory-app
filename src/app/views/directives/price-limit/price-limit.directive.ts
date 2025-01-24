import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPriceLimit]',
  standalone: false
})
export class PriceLimitDirective {

  private readonly maxLength = 10; // Maximum total length (including the decimal point)
  private readonly decimalPlaces = 2; // Maximum number of decimal places

  constructor(private el: ElementRef) {}

  // Listen to the input event and handle validation
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const value = inputElement.value;

    // Get the current cursor position
    const cursorPosition = inputElement.selectionStart;

    // Regular expression to match up to 10 digits and allow a maximum of 2 digits after the decimal point
    const regex = /^(\d{1,8}(\.\d{0,2})?)?$/; // Matches up to 8 digits before the decimal, and 2 digits after.

    // If the value doesn't match the pattern, remove the invalid part
    let updatedValue = value;
    if (!regex.test(value)) {
      updatedValue = value.slice(0, -1); // Remove the last character that doesn't match
    }

    // Ensure the input value does not exceed the max length
    if (updatedValue.length > this.maxLength) {
      updatedValue = updatedValue.slice(0, this.maxLength); // Trim to the maximum allowed length
    }

    // Update the value in the input field
    inputElement.value = updatedValue;

    // Set the cursor position back to where it was before the input change
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }
}
