import { Factura } from "./factura";
import { RegionModel } from "./RegionModel";

export class ClienteModel {
  id!: number;
  nombre!: string;
  apellido!: string;
  createAt!: string | null;
  email!: string;
  foto!: string;
  region!: RegionModel;

  facturas: Array<Factura> = [];
}
