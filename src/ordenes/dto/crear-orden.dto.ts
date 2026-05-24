export class CrearPaqueteDto {
  contenido!: string;
  pesoLibras!: number;
  ancho!: number;
  alto!: number;
  largo!: number;
}

export class CrearOrdenDto {
  direccionRecoleccion!: string;
  fechaProgramada!: string;
  nombreDestinatario!: string;
  apellidoDestinatario!: string;
  correoDestinatario?: string;
  telefonoDestinatario!: string;
  direccionDestinatario!: string;
  departamento!: string;
  municipio!: string;
  referencia?: string;
  indicaciones?: string;
  esCOD?: boolean;
  montoEsperado?: number;
  paquetes!: CrearPaqueteDto[];
}