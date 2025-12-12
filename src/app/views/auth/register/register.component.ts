import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  usernameExists,
  notsame1,
  userEmailExists,
} from "../../validator/string.validator";
import { StringValidator } from "../../validator/string.validator";
import { UserService } from "src/services/users/user.service";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isDialog: any = "";
  registerForm: FormGroup;

  // Define form controls with conditional validators
  username = new FormControl("", {
    validators: [Validators.required],
    asyncValidators: [usernameExists(this.userService)],
    updateOn: "blur",
  });

  email = new FormControl("", {
    validators: [Validators.required, Validators.email],
    asyncValidators: [userEmailExists(this.userService)],
    updateOn: "blur",
  });

  password = new FormControl("", [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(30),
    StringValidator.hasUpperCase,
    StringValidator.hasDigit,
    StringValidator.hasSpecialChar,
  ]);

  confirmpassword = new FormControl("", {
    validators: [Validators.required, notsame1()],
  });

  hidepass: boolean = true;
  togglePasswordVisibilityofFirstLogin() {
    this.hidepass = !this.hidepass;
  }

  hideconfirmpass: boolean = true;
  toggleConfirmPasswordVisibilityofFirstLogin() {
    this.hideconfirmpass = !this.hideconfirmpass;
  }

  constructor(
    private alertService: AlertsServicesService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    public router: Router,
    public translateService: TranslateService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();
    this.currentLanguage = browserlang;

    this.registerForm = this.formBuilder.group(
      {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword,
      },
      {
        validators: this._passwordMatchValidator(),
      }
    );

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  private _passwordMatchValidator() {
    return (control: AbstractControl) => {
      const password = control.get("password");
      const confirmPassword = control.get("confirmpassword");

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors["mismatch"]) {
        // If there's another error, skip overwriting it.
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }

      return null;
    };
  }

  ngOnInit(): void {}

  gotologin() {
    this.router.navigateByUrl("login");
  }

  register() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.http.register(this.registerForm).subscribe(
        (response) => {
          if (response && response?.message) {
            this.alertService.showAlert("success", `${response?.message}`);
            this.router.navigate(["/login"]);
          } else {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user_token", response?.authorisation?.token);
            if (
              response.user.permissions !== undefined &&
              response.user.permissions !== null
            ) {
              sessionStorage.setItem(
                "permissions",
                JSON.stringify(response.user.permissions)
              );
            }
            if (
              response.user.roles !== undefined &&
              response.user.roles !== null
            ) {
              sessionStorage.setItem("roles", response.user.roles.join(","));
            }
            localStorage.setItem("userType", response?.user?.type);
            localStorage.setItem("userID", response?.user?.id);
            const isAdmin = response?.user?.type === "chronosouq-user";
            if (isAdmin) {
              localStorage.setItem("isAdmin", "true");
            }
            // this.router.navigateByUrl("");
            this.router.navigateByUrl("").then(() => {
              window.location.reload();
            });
          }
        },
        (error) => {
          if (error && error?.error?.error) {
            this.alertService.showAlert("warning", `${error?.error?.error}`);
          } else if (error && error?.error?.message) {
            this.alertService.showAlert("warning", `${error?.error?.message}`);
          } else {
            this.alertService.showAlert("warning", "Error in Register");
          }
        }
      );
    } else {
      // if (this.translateService.currentLang == "en") {
      //   this.alertService.showAlert("warning", "Please Enter Valid Form Values");
      // }else{
      //      this.alertService.showAlert("warning", "يرجى إدخال قيم صحيحة في النموذج");
      // }
    }
  }
}
