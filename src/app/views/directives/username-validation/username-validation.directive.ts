import { Directive, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appUsernameValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UsernameValidationDirective,
      multi: true,
    },
  ],
})
export class UsernameValidationDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && /\s/.test(value)) {
      return { noSpaces: true };
    }
    return null;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault(); // Prevent space key from being entered
    }
  }
}