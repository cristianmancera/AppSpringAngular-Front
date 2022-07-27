import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from 'src/app/Models/factura';
import { FacturaService } from 'src/app/Services/factura.service';

@Component({
  selector: 'app-detalle-facturas',
  templateUrl: './detalle-facturas.component.html'
})
export class DetalleFacturasComponent implements OnInit {

  factura!: Factura;
  titulo = 'Factura';
  constructor(private facturaService: FacturaService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) {
        let iD = Number(id);
        this.facturaService.getFactura(iD).subscribe(factura => {
          this.factura = factura;
          this.factura.total = 0;
          this.factura.items.map(ite => {

            this.factura.total = this.factura.total + ite.importe

          })
          console.log(factura.total);

        })
      }
    })



  }
}
