import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ClienteModel } from 'src/app/Models/ClienteModel';
import { Factura } from 'src/app/Models/factura';
import { AuthService } from 'src/app/Services/auth.service';
import { ClienteService } from 'src/app/Services/cliente.service';
import { FacturaService } from 'src/app/Services/factura.service';
import { ModalService } from 'src/app/Services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente!: ClienteModel;

  titulo = "Detalle del cliente";
  enviable = false;




  public progreso: number = 0;
  public fotoSeleccionada!: File | null;

  constructor(private clienteService: ClienteService, public modalService: ModalService, public authService: AuthService, private facturaService: FacturaService) {



  }

  ngOnInit(): void {
    this.cliente.facturas.map(factur => {
      factur.total = 0;
      factur.items.map(ite => {

        factur.total = factur.total + ite.importe

      })
    })


  }
  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada) {
      if (this.fotoSeleccionada.type.indexOf('image') < 0) {
        Swal.fire('Error seleccionar imagen:', `El archivo debe ser de tipo imagen`, 'error');
        this.enviable = false;
      } else {
        this.enviable = true;
      }
    }

  }

  subirFoto() {
    if (!this.fotoSeleccionada && this.enviable == false) {
      Swal.fire('Error upload:', `Debe seleccionar una foto`, 'error');
    } else {
      this.enviable = false;
      if (this.fotoSeleccionada) {

        this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
          .subscribe((event: { type: HttpEventType; total: number; loaded: number; body: any; }) => {
            if (event.type === HttpEventType.UploadProgress) {
              if (event.total) {

                this.progreso = Math.round((event.loaded / event.total) * 100);
              }
            } else if (event.type === HttpEventType.Response) {
              let response: any = event.body;
              this.cliente = response.cliente as ClienteModel;

              this.modalService.notificaUpload.emit(this.cliente);
              Swal.fire('La foto se ha subido completamente', response.mensaje, 'success');
            }

          })
      }
    }
  }

  cerrarModal() {
    this.fotoSeleccionada = null;
    this.progreso = 0;
    this.enviable = false;
    this.modalService.cerrarModal();
  }

  delete(factura: Factura): void {
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
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

        this.facturaService.delete(factura.id).subscribe(
          () => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
            Swal.fire(
              'Factura Eliminado!',
              `Factura ${factura.descripcion} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    })
  }
}
