import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFieldLimitIntoHundered]',
  standalone: false
})
export class FieldLimitIntoHunderedDirective {

  constructor(private el: ElementRef) { }

  // Listen for input events
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const inputElement = this.el.nativeElement;
    
    // Check if the value exceeds 100 characters
    if (inputElement.value.length > 100) {
      inputElement.value = inputElement.value.substring(0, 100);  // Trim the value to 100 characters
    }
  }
}
