import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPositiveNumber]',
})
export class PositiveNumberDirective {
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;

    // Remove all non-numeric characters except "+"
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Set the cleaned value back to the input field
    input.value = inputValue;
  }
}
