import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

import { Router } from '@angular/router';

import { ClienteModel } from '../Models/ClienteModel';

import { RegionModel } from '../Models/RegionModel';
@Injectable()
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';


  constructor(private http: HttpClient, private router: Router) { }



  subirFoto(archivo: File, id: any): any {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    })

    return this.http.request(req);
  }


  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + "/page/" + page).pipe(
      tap((response: any) => {
        (response.content as ClienteModel[]).forEach(cliente => {



        })
      }),
      map((response: any) => {
        (response.content as ClienteModel[]).map((cliente: ClienteModel) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // let datePipe = new DatePipe('es');
          // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM, yyyy')
          return cliente;
        });
        return response
      }),
      tap(response => {
        // let clientes = response as ClienteModel[]
        (response.content as ClienteModel[]).forEach(cliente => {


        })
      }),
    );
  }

  create(cliente: ClienteModel): Observable<any> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as ClienteModel),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        if (e.error.mensaje) {

          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id: any): Observable<any> {
    return this.http.get<ClienteModel>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: ClienteModel): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {

          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.error.mensaje) {

          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }


  getRegiones(): Observable<RegionModel[]> {
    return this.http.get<RegionModel[]>(this.urlEndPoint + "/regiones");
  }

  // private agregarAthorizationHeader() {
  //   let token = this.authService.token;
  //   if (token != null && token.length > 0) {
  //     return this.httpHeaders.append('Authorization', 'Bearer ' + token);
  //   }
  //   return this.httpHeaders;
  // }


  // private isNoAutorizado(e: any): boolean {
  //   if (e.status == 401) {

  //     if (this.authService.isAuthenticated()) {
  //       this.authService.logout()
  //     }
  //     this.router.navigate(['/login']);
  //     return true;
  //   }

  //   if (e.status == 403) {
  //     Swal.fire('Acceso denegado', 'Hola ' + this.authService.usuario.username + ' no tienes acceso a este recurso', 'warning');
  //     this.router.navigate(['/clientes']);
  //     return true;
  //   }
  //   return false;
  // }
}
