import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from 'src/app/Models/factura';
import { ClienteService } from 'src/app/Services/cliente.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { FacturaService } from 'src/app/Services/factura.service';
import { Producto } from 'src/app/Models/producto';
import { ItemFactura } from 'src/app/Models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})

export class FacturasComponent implements OnInit {

  titulo = 'Nueva factura';
  factura = new Factura();


  autoCompleteControl = new FormControl('');

  productosFiltrados!: Observable<Producto[]>;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute, private facturaService: FacturaService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteID = params.get('clienteId')
      if (clienteID) {
        this.clienteService.getCliente(clienteID).subscribe(cliente => this.factura.cliente = cliente);
      }
    })
    this.productosFiltrados = this.autoCompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.producto),
      flatMap(value => value ? this._filter(value || '') : [])
    );
  }


  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): any {
    return producto ? producto.nombre : undefined;
  }
  seleccionarProducto(event: any) {
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    }
    else {

      let nuevoItem = new ItemFactura();

      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autoCompleteControl.setValue('');

    event.option.focus();

    event.option.deselect();

  }
  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;

    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true
      }
    });
    return existe;
  }
  incrementaCantidad(id: number): void {


    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }
  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }
  create(facturaForm: any): void {
    console.log(this.factura);

    if (this.factura.items.length == 0) {
      this.autoCompleteControl.setErrors({ 'invalid': true })
    }
    if (facturaForm.form.valid && this.factura.items.length > 0) {

      this.facturaService.create(this.factura).subscribe(factura => {
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito`, 'success');
        this.router.navigate(['/facturas', factura.id]);
      })
    }
  }
}
