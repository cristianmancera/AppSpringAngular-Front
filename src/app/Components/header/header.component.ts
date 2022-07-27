import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'App Angular'
  constructor(public authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    console.log(this.authService.isAuthenticated());

  }

  logout(): void {
    Swal.fire('Logout', 'Hola' + this.authService.usuario.username + ' has cerrado sesion con exito', 'success');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
