import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm:FormGroup;

  constructor(
    public router: Router,
    private fb:FormBuilder
  ){

    this.loginForm=this.fb.group({
      email:['',[Validators.email,Validators.required]],
      password:['',Validators.required]
    })

  }
  gotoHome(){
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid){
      this.router.navigateByUrl('')
    }

  }
  gotoRegister(){
    this.router.navigateByUrl('register')
  }
}
