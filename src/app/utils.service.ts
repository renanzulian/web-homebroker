import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  setUser(email, name) {
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
  }

  logout() {
    localStorage.clear()
  }
}
