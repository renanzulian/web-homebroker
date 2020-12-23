import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private utils: UtilsService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.utils.logout();
    this.router.navigate(['/login']);
  }
}
