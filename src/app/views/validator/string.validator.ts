import { AbstractControl, AsyncValidatorFn, UntypedFormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { UserService } from "src/services/users/user.service";
import { map } from 'rxjs/operators';

export class StringValidator {
  static noAllSpaces(control: AbstractControl): ValidationErrors | null {
    try {
      if (!!control.value && typeof control.value == 'string') {
        if (control.value.length > 0 && control.value.trim().length === 0) {
          return { noAllSpaces: true }
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  static checkInvalidChars(control: AbstractControl): ValidationErrors | null {
    try {
      let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!])[^\s&%|]*$/;
      if (control.value.length > 0 && !pattern.test(control.value)) {
        return { invalidPassword: true };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  static hasLowerCase(control: AbstractControl): ValidationErrors | null {
    try {
      let pattern = /[a-z]/;
      if (!pattern.test(control.value)) {
        return { hasLowerCase: true };
      }
      return null;
    } catch (error) {
      return null
    }
  }
  static hasUpperCase(control: AbstractControl): ValidationErrors | null {
    try {
      let pattern = /[A-Z]/;
      if (!pattern.test(control.value)) {
        return { hasUpperCase: true };
      }
      return null;
    } catch (error) { return null }
  }

  static hasDigit(control: AbstractControl): ValidationErrors | null {
    try {
      let pattern = /\d/;
      if (!pattern.test(control.value)) {
        return { hasDigit: true };
      }
      return null;
    } catch (error) { return null }
  }

  static hasSpecialChar(control: AbstractControl): ValidationErrors | null {
    try {
      let pattern = /[@$!&%|]/;;
      if (!pattern.test(control.value)) {
        return { hasSpecialChar: true };
      }
      return null;
    } catch (error) { return null }
  }
  static noSpaces(control: AbstractControl): ValidationErrors | null {
    try {
      if (!!control.value && typeof control.value == 'string') {
        if (control.value.length > 0 && control.value.includes(" ")) {
          return { noSpaces: true }
        }
      }
      return null
    } catch (error) {
      return null
    }
  }
  static validURL(control: AbstractControl): ValidationErrors | null {
    let url;
    try {
      url = new URL(control.value);
    } catch (_) {
      return { validURL: true }
    }
  }
  static hasSpecialCharacters(control: AbstractControl): ValidationErrors | null {
    try {
      var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (format.test(control.value)) {
        return { hasSpecialCharacters: true }
      }
      return null
    } catch (error) {
      return null
    }
  }
  static notAllowed(control: AbstractControl): ValidationErrors | null {
    try {
      if (control.value == localStorage.env + "_") {
        return { notAllowed: true }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function notsame(password: AbstractControl): ValidatorFn {
  return (confirmPassword: AbstractControl): ValidationErrors | null => {
    try {
      if (!!confirmPassword.value && typeof confirmPassword.value == 'string') {
        if (password.value != confirmPassword.value) {
          return { 'notsame': true }
        }
      }
      return null
    } catch (e) {
      return null
    }
  }
}

export function machineNameExists(robots: any, ignore = false): ValidatorFn {
  if (ignore) {
    robots.existingMachines = robots.existingMachines.filter(e => 'assignedLabels' in e && e.assignedLabels[0].name != ignore)
  }
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (typeof robots === 'object' && 'existingMachines' in robots && robots.existingMachines.filter(e => 'assignedLabels' in e && e.assignedLabels.some(f => f.name == control.value)).length > 0) {
        return { 'nameExists': true }
      }
      return null
    } catch (e) {
      return null
    }
  }
}


export function tryBuildVersionUploaded(builds: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      // console.log(builds)
      if (builds.some(e => e.name == control.value)) {
        return { 'buildExist': true }
      }
      return null
    } catch (e) {
      return null
    }
  }
}

export function invalidExtension(extension: string, files: File[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      const filesArray = Array.from(files)
      if (filesArray.some(file => file.name.split(".").pop() != extension)) {
        return { 'invalidExt': true }
      }
      return null
    } catch (e) {
      return null
    }
  }
}

export function envNameExists(envs: any, ignore = false): ValidatorFn {
  if (ignore) {
    envs = envs.filter(e => e != ignore)
  }
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (envs.filter(e => e == control.value).length > 0) {
        return { 'nameExists': true }
      }
      return null
    } catch (e) {
      return null
    }
  }
}
export function usernameExists(userService: UserService): ValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkUsernameExists(control.value).pipe(
      map(exists => exists ? { 'usernameExists': true } : null)
    );
  }
}

export function robotNameExists(robots: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (robots.filter(e => e.robotName == control.value).length > 0) {
        return { 'nameExists': true }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function notAllowed(value: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (value.includes(control.value.toLowerCase())) {
        return { 'notAllowed': true }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function isNameExisting(object: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (Array.isArray(object) && (object.includes(control.value) || object.filter(e => e.name == control.value).length > 0 || object.filter(e => e.name == localStorage.env + "_" + control.value).length > 0)) {
        return { 'isExisting': true }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function isAssetExisting(object: any, ignore = false): ValidatorFn {
  if (ignore) {
    object = object.filter(e => e.noenvkey != ignore)
  }
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (Array.isArray(object) && object.filter(e => e.noenvkey == control.value).length > 0) {
        return { 'isExisting': true }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function isUsernameExisting(object: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      if (typeof object === 'object' && object !== null && object['usersDataSource'].data.filter(e => e.id == control.value).length > 0) {
        return { 'isExisting': true }
      }
      return null
    } catch (error) {
      return null
    }
  }
}

export function compareAssetsParameters(form: UntypedFormGroup) {
  let valueOne = form.value.envlocalVars.split(",");
  let valueTwo = form.value.buildParams.split(",");
  const matchingWords = valueOne.filter(value => valueTwo.includes(value) && valueTwo != '')
  if (matchingWords.length > 0) {
    form.controls['buildParams'].setErrors({ 'matchingWords': matchingWords.join(", ") })
  }
  form.controls['envlocalVars'].markAsTouched();
  form.controls['buildParams'].markAsTouched();
  return null;
}
