import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private utils: UtilsService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit(): void {}

  doLogin() {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:3000/login', {
          email: this.loginForm.get('email').value,
          password: this.loginForm.get('password').value,
        })
        .subscribe(
          (result) => {
            this.utils.setUser(result['email'], result['name']);
            this.router.navigate(['/wallet']);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
