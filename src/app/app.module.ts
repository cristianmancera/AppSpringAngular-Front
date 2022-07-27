import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DirectivaComponent } from './Components/directiva/directiva.component';
import { ClientesComponent } from './Components/clientes/clientes.component';
import { FormComponent } from './Components/clientes/form/form.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { PaginatorComponent } from './Components/paginator/paginator.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ClienteService } from './Services/cliente.service';


import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { MatNativeDateModule } from '@angular/material/core';
import { DetalleComponent } from './Components/clientes/detalle/detalle.component';
import { LoginComponent } from './Components/usuarios/login/login.component';

import { TokenInterceptor } from './Interceptors/token.interceptor';
import { AuthInterceptor } from './Interceptors/auth.interceptor';
import { DetalleFacturasComponent } from './Components/clientes/detalle-facturas/detalle-facturas.component';
import { FacturasComponent } from './Components/facturas/facturas.component';
registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    AppComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    FooterComponent,
    HeaderComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturasComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [
    ClienteService,
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
