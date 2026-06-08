import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CrearPaqueteDto {
  @IsString() @IsNotEmpty()
  contenido!: string;

  @IsNumber() @Min(0.01)
  pesoLibras!: number;

  @IsNumber() @Min(1)
  ancho!: number;

  @IsNumber() @Min(1)
  alto!: number;

  @IsNumber() @Min(1)
  largo!: number;
}

export class CrearOrdenDto {
  @IsString() @IsNotEmpty()
  direccionRecoleccion!: string;

  @IsString() @IsNotEmpty()
  fechaProgramada!: string;

  @IsString() @IsNotEmpty()
  nombreDestinatario!: string;

  @IsString() @IsNotEmpty()
  apellidoDestinatario!: string;

  @IsOptional() @IsEmail()
  correoDestinatario?: string;

  @IsString() @IsNotEmpty()
  telefonoDestinatario!: string;

  @IsString() @IsNotEmpty()
  direccionDestinatario!: string;

  @IsString() @IsNotEmpty()
  departamento!: string;

  @IsString() @IsNotEmpty()
  municipio!: string;

  @IsOptional() @IsString()
  referencia?: string;

  @IsOptional() @IsString()
  indicaciones?: string;

  @IsOptional() @IsBoolean()
  esCOD?: boolean;

  @IsOptional() @IsNumber()
  montoEsperado?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearPaqueteDto)
  paquetes!: CrearPaqueteDto[];
}