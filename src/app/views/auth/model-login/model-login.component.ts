import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
import { ModelRegisterComponent } from "../model-register/model-register.component";

@Component({
  selector: "app-model-login",
  templateUrl: "./model-login.component.html",
  styleUrls: ["./model-login.component.css"],
})
export class ModelLoginComponent implements OnInit {
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
    public dialogRef: MatDialogRef<ModelLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }

    if (data) {
      this.isDialog = data.message;
    }
  }

  routeTo: any;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }
  gotoHome() {
    this.loginForm.markAllAsTouched();
    localStorage.removeItem("Logged");
    localStorage.removeItem("user_token");
    if (this.loginForm.valid) {
      this.http.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.message === "" || response.status === "failure") {
            this.alertService.showAlert(
              "danger",
              "Enter valid username/email and password"
            );
          } else {
            localStorage.setItem("Logged", "LogIn");
            localStorage.setItem("user_token", response.authorization.token);
            
            if (this.isDialog === "dialog-box") {
              this.dialogRef.close(true);
            } else {
              this.router.navigateByUrl("");
            }
          }
        },
        (error) => {
          if (error.message === "Unauthorized") {
            this.alertService.showAlert(
              "danger",
              "Enter Valid Email and Password"
            );
          }
          console.error("Login error", error);
        }
      );
    } else {
      this.alertService.showAlert("info", "Enter UserName/Email and Password");
    }
  }
  gotoRegister() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ModelRegisterComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close();
      }
    });
  }
}
