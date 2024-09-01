import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
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
    public router: Router,
    private fb: FormBuilder,
    private http: HttpService
  ) {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }

  routeTo: any;

  ngOnInit(): void {
    this.routeTo = history.state.paramRoute;
  }
  gotoHome() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.http.login(this.loginForm.value).subscribe(
        (response) => {
          localStorage.setItem("Logged", "LogIn");
          console.log(
            "Login successful and token is = ",
            response.authorisation.token
          );
          localStorage.setItem("token", response.authorisation.token);
          if (this.routeTo) {
            this.router.navigateByUrl("buy-product");
          } else {
            this.router.navigateByUrl("");
          }
        },
        (error) => {
          console.error("Login error", error);
        }
      );
    }
  }
  gotoRegister() {
    this.router.navigateByUrl("register");
  }
}
