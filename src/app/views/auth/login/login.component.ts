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
    Validators.minLength(6),
    Validators.maxLength(30),
  ]);
  constructor(
    public alertService: AlertsServicesService,
    public router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public translateService: TranslateService,
    private loginStateService:LoginStateService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    console.log("Browser Language => ", browserlang);
    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  routeTo: any;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
    if(!!localStorage.getItem('user_token')){
      this.router.navigateByUrl("");
    }
  }
  gotoHome() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.http.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.errorMessage || response.status === "failure") {
            this.alertService.showAlert(
              "danger",
              "Enter valid username/email and password"
            );
          } else {
            localStorage.setItem('Logged', 'LogIn');
            this.loginStateService.updateLoginStatus(true);
            localStorage.setItem("user_token", response.authorization.token);

            const isAdmin = response.user.type === 'admin';

            if(isAdmin){
              this.loginStateService.updateAdminStatus(isAdmin);
              localStorage.setItem('isAdminLogin',response.user.type)
            }
            this.router.navigateByUrl("");
          }
        },
        (error) => {
          this.alertService.showAlert(
            "danger",
            "Enter Valid Email and Password"
          );
          console.error("Login error", error);
        }
      );
    } else {
      this.alertService.showAlert("info", "Enter UserName/Email and Password");
    }
  }
  gotoRegister() {
    this.router.navigateByUrl("register");
  }
}
