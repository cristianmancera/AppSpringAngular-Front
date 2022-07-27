import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router'
import { ClienteModel } from 'src/app/Models/ClienteModel';
import { RegionModel } from 'src/app/Models/RegionModel';
import { ClienteService } from 'src/app/Services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: ClienteModel = new ClienteModel()
  public regiones: RegionModel[] = [];
  public titulo: string = "Crear Cliente"

  public hayErr: boolean = false;
  public errores: String[] = [];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let id: any = null;
    this.activatedRoute.paramMap.subscribe(params => {

      id = params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }


  create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente)
      .subscribe(response => {

        console.log("status" + response.status);

        if (response.status == undefined) {
          Swal.fire('Nuevo cliente', `El cliente : ${this.cliente.nombre} ha sido creado con exito`, 'success')
          this.router.navigate(['/clientes'])

        } else if (response.status == 400) {

          Swal.fire(response.error.errors[0], "", 'error');
          this.hayErr = true
          this.errores = response.error.errors as string[];
        } else if (response.status == 500) {
          Swal.fire('Error', `El cliente : ${this.cliente.nombre} Ya existe`, 'error')
        }
      })
  }

  update(): void {
    console.log(this.cliente);
    this.cliente.facturas = [];

    this.clienteService.update(this.cliente)
      .subscribe(json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
        err => {
          this.errores = err.error.errors as string[];
          console.error("Codigo del error desde el backend: " + err.status);
          console.error(err.error.errors);

        }

      )
  }
  compararRegion(o1: RegionModel, o2: RegionModel): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
