import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  usernameExists,
  notsame1,
  userEmailExists,
} from "../../validator/string.validator";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { UserService } from "src/services/users/user.service";
import { HttpService } from "src/services/http/http.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { ModelLoginComponent } from "../model-login/model-login.component";

@Component({
  selector: "app-model-register",
  templateUrl: "./model-register.component.html",
  styleUrls: ["./model-register.component.css"],
})
export class ModelRegisterComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isDialog: any = "";
  registerForm: FormGroup;
  username = new FormControl("", {
    validators: [Validators.required],
    asyncValidators: [usernameExists(this.userService)],
    updateOn: "blur",
  });
  email = new FormControl("", {
    validators: [Validators.required, Validators.email],
    asyncValidators: [userEmailExists(this.userService)], // Async validator
    updateOn: "blur", // Validate on blur
  });
  password: FormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30),
  ]);
  confirmpassword: FormControl = new FormControl("", {
    validators: [Validators.required, notsame1()],
  });

  constructor(
    private alertService: AlertsServicesService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    public router: Router,
    private dialog: MatDialog,
    public translateService: TranslateService,
    public dialogRef: MatDialogRef<ModelRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }

    this.registerForm = this.formBuilder.group(
      {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword
      },
      {
        validators: notsame1(),
      }
    );

    if (this.dialogRef && this.data) {
      this.isDialog = data.message;
    }
  }
  ngOnInit(): void {
   
  }

  gotologin() {

    this.dialogRef.close();
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  register() {
    this.registerForm.markAllAsTouched();
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user_token")
    if (this.registerForm.valid) {
      this.http.register(this.registerForm).subscribe(
        (response) => {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user_token", response.authorisation.token);
          localStorage.setItem('userType',response.user.type)
          localStorage.setItem("userID", response.user.id);
            window.location.reload();
          this.dialogRef.close();
        },
        (error) => {
          this.alertService.showAlert("warning", "Enter Form Values");
          console.error("Registration error", error);
        }
      );
    } else {
      this.alertService.showAlert("warning", "Enter Form Values");
    }
  }
}
