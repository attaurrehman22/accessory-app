import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyCharacterLimitThirty]',
  standalone: false
})
export class OnlyCharacterLimitThirtyDirective {

  private readonly maxLength = 30;  // Maximum length of input

  constructor(private el: ElementRef) {}

  // Listen to the input event to filter the value and apply the limit
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let value = inputElement.value;

    // Allow only alphabetic characters (A-Z or a-z) using regex
    value = value.replace(/[^a-zA-Z]/g, '');

    // Limit input length to 30 characters
    if (value.length > this.maxLength) {
      value = value.substring(0, this.maxLength);
    }

    // Update the value in the input field
    inputElement.value = value;
  }
}
