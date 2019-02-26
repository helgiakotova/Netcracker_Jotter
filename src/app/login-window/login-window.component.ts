import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../services';
import Backendless from 'backendless';

@Component({
  selector: 'app-login-window',
  templateUrl: './login-window.component.html',
  styleUrls: ['./login-window.component.less']
})
export class LoginWindowComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  clickMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const currUsername = this.f.username.value;
    const currPassword = this.f.password.value;

    if (this.cookieService.get('users')) {
      const listUser = JSON.parse(this.cookieService.get('users'));
      for (let i = 0; i < listUser.length; i++) {
        if (currUsername === listUser[i]['username'] && currPassword === listUser[i]['password']) {
          this.authenticationService.login(listUser[i]);
          this.router.navigate([this.returnUrl]);
          return;
        } else {
          this.clickMessage = 'Oops! Looks like either your email address or password were incorrect. Wanna try again or register?';
        }
      }
    }
  }
}
