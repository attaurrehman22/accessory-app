import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimInput]',
})
export class TrimInputDirective {
  constructor(private ngControl: NgControl) {}

  // Trim on blur (when input loses focus)
  @HostListener('blur')
  onBlur() {
    const value: string = this.ngControl.control?.value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      this.ngControl.control?.setValue(trimmed, { emitEvent: false });
    }
  }

  // Optional: trim leading spaces while typing
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && typeof input.value === 'string') {
      const cursorPosition = input.selectionStart;
      const newValue = input.value.replace(/^\s+/, '');
      if (input.value !== newValue) {
        this.ngControl.control?.setValue(newValue);
        input.value = newValue;
        input.setSelectionRange(cursorPosition! - 1, cursorPosition! - 1);
      }
    }
  }

}
