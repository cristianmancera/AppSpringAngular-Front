import { Component, OnInit } from '@angular/core';
import { ClienteModel } from 'src/app/Models/ClienteModel';
import { ClienteService } from 'src/app/Services/cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/Services/modal.service';
import { AuthService } from 'src/app/Services/auth.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: ClienteModel[] = [];

  paginador!: any;
  clienteSeleccionado!: ClienteModel;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, public modalService: ModalService, public authService: AuthService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: any = params.get('page');

      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {

          (response.content as ClienteModel[]).forEach(cliente => {

          })
        })
      ).subscribe(response => {

        this.clientes = response.content as ClienteModel[]
        this.paginador = response
      });
    }

    )
    this.modalService.notificaUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;

        }
        return clienteOriginal;
      })
    });
  }

  delete(cliente: ClienteModel): void {
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    })
  }

  abrirModal(cliente: ClienteModel) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
