import { ClienteModel } from "./ClienteModel";
import { ItemFactura } from "./item-factura";

export class Factura {
    id!: number;
    descripcion!: string;
    observacion!: string;
    items: Array<ItemFactura> = [];
    cliente!: ClienteModel;
    total: number = 0;
    createAt!: string;

    calcularGranTotal(): number {
        this.total = 0;
        this.items.forEach((item: ItemFactura) => {
            this.total = this.total + item.calcularImporte();
        });
        return this.total;
    }
}
