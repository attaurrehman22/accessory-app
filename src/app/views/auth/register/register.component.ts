import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { usernameExists,notsame } from '../../validator/string.validator';
import { UserService } from 'src/services/users/user.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule, MatCheckboxModule, MatRadioModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  userService: UserService
  email: FormControl = new FormControl('',[Validators.required, Validators.email])
  username: FormControl = new FormControl(''[Validators.required,(usernameExists(this.userService) as Validators)]])
  password: FormControl = new FormControl('',[Validators.required])
  confirmpassword: FormControl = new FormControl('',[Validators.required, notsame(this.password)])

  RegisterForm: FormGroup

  constructor(
    public router: Router,
  ) { }
  ngOnInit(): void {
    this.RegisterForm = new FormGroup({
      email: this.email,
      username: this.username,
      password: this.password,
      confirmpassword: this.confirmpassword
    })
  }
  gotologin() {
    this.router.navigateByUrl('')
  }

  register() {
    console.log(this.RegisterForm.value)
  }
}
