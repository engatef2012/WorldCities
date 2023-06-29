import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { LoginRequest} from './login-request';
import { LoginResult } from './login-result';
import { BaseFormComponent } from '../base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseFormComponent implements OnInit {

  constructor(private authService: AuthService,
  private router:Router) {
  super()}
  title?: string;
  loginResult?: LoginResult;
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('',Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  onSubmit() {
    var loginRequest: LoginRequest = <LoginRequest>{};
    loginRequest.email = this.form.controls['email'].value;
    loginRequest.password = this.form.controls['password'].value;
    this.authService.login(loginRequest).subscribe({ next: result => {
      this.loginResult = result;
      console.log(result);
      if (result.success) {
        this.router.navigate(['/']);
      }
    }
      , error: error => {
        console.log(error);
        if (error.status == 401) {
          this.loginResult = error.error;
        }
      }
    })
  }
}
