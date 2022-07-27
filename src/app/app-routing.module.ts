import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './Components/clientes/clientes.component';
import { DirectivaComponent } from './Components/directiva/directiva.component';
import { FormComponent } from './Components/clientes/form/form.component';
import { LoginComponent } from './Components/usuarios/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { DetalleFacturasComponent } from './Components/clientes/detalle-facturas/detalle-facturas.component';
import { FacturasComponent } from './Components/facturas/facturas.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'facturas/:id', component: DetalleFacturasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_USER' } },
  { path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: '**', pathMatch: 'full', redirectTo: '/clientes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
