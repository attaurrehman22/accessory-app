import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { RegisterComponent } from "../register/register.component";
import { LoginStateService } from "src/services/login-service/login-state.service";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isDialog: any = "";
  loginForm: FormGroup;
  email: FormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  password: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(30),
  ]);
  constructor(
    public alertService: AlertsServicesService,
    public router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public translateService: TranslateService,
    private loginStateService: LoginStateService,
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  hidepass: boolean = true;
  togglePasswordVisibilityofFirstLogin() {
    this.hidepass = !this.hidepass;
  }

  routeTo: any;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
    if (!!localStorage.getItem("user_token")) {
      this.router.navigateByUrl("");
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    this.loginStateService.updateLoginStatus(isLoggedIn);
    if (isAdmin) {
      this.loginStateService.updateAdminStatus(isAdmin);
    }
  }
  gotoHome() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.http.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.errorMessage || response.status === "failure") {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                "Please Enter your Email and Password",
              );
            } else {
              this.alertService.showAlert(
                "warning",
                "يرجى إدخال بريدك الإلكتروني وكلمة المرور",
              );
            }
          } else {
            const isAdmin = response.user.type === "chronosouq-user";
            localStorage.setItem("user_token", response.authorization.token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userID", response.user.id);
            localStorage.setItem("userType", response.user.type);
            if (
              response.user.permissions !== undefined &&
              response.user.permissions !== null
            ) {
              localStorage.setItem(
                "permissions",
                JSON.stringify(response.user.permissions),
              );
            }
            if (
              response.user.roles !== undefined &&
              response.user.roles !== null
            ) {
              localStorage.setItem("roles", response.user.roles.join(","));
            }
            if (isAdmin) {
              localStorage.setItem("isAdmin", "true");
            }

            this.router.navigateByUrl("").then(() => {
              window.location.reload();
            });
          }
        },
        (error) => {
          if (error && error?.error?.error) {
            this.alertService.showAlert("warning", `${error?.error?.error}`);
          } else if (error && error?.error?.message) {
            if (
              `${error?.error?.message}` == "Unauthorized" ||
              `${error?.error?.message}` == "unauthorized"
            ) {
              this.alertService.showAlert(
                "warning",
                "Please enter a valid email and password. If you don't have an account, please proceed to register.",
              );
            } else {
              this.alertService.showAlert(
                "warning",
                `${error?.error?.message}`,
              );
            }
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                "You entered an incorrect email or password",
              );
            } else {
              this.alertService.showAlert(
                "warning",
                "لقد أدخلت بريدًا إلكترونيًا أو كلمة مرور غير صحيحة",
              );
            }
          }
          console.error("Login error", error);
        },
      );
    } else {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert(
          "warning",
          "Please Enter your Email and Password",
        );
      } else {
        this.alertService.showAlert(
          "warning",
          "يرجى إدخال بريدك الإلكتروني وكلمة المرور",
        );
      }
    }
  }

  async signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
    } catch (error) {
      this.alertService.showAlert("warning", "Google sign-in failed");
      console.error(error);
    }
  }

  gotoRegister() {
    this.router.navigateByUrl("register");
  }
}
