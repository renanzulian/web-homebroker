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
  registerForm: FormGroup;

  loginError = '';
  registerError = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.minLength(6)],
    });

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.minLength(6)],
      rePassword: ['', Validators.minLength(6)],
    });
  }

  ngOnInit(): void {}

  doLogin() {
    if (this.loginForm.valid) {
      this.loginError = '';
      this.http
        .post('http://localhost:3000/login', {
          email: this.loginForm.get('email').value,
          password: this.loginForm.get('password').value,
        })
        .subscribe(
          (result) => {
            localStorage.setItem('token', result['token']);
            localStorage.setItem('name', result['name']);
            this.router.navigate(['/wallet']);
          },
          (error) => {
            console.log(error);
            this.loginError = error.error;
          }
        );
    }
  }

  register() {
    this.registerError = '';
    const password = this.registerForm.get('password').value;
    const rePassword = this.registerForm.get('rePassword').value;
    if (this.registerForm.valid) {
      if (password !== rePassword) {
        this.registerError = 'As senhas inseridas devem ser a mesma';
      } else {
        this.http
          .post('http://localhost:3000/register', {
            name: this.registerForm.get('name').value,
            email: this.registerForm.get('email').value,
            password: this.registerForm.get('password').value,
          })
          .subscribe(
            (result) => {
              localStorage.setItem('token', result['token']);
              localStorage.setItem('name', result['name']);
              this.router.navigate(['/wallet']);
            },
            (error) => {
              console.log(error.message);
              this.registerError = error.error;
            }
          );
      }
    }
  }
}
