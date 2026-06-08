import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class FiltrosOrdenDto {
  @IsOptional() @IsString()
  estado?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  esCOD?: boolean;

  @IsOptional() @IsString()
  nombreDestinatario?: string;

  @IsOptional() @IsDateString()
  fechaDesde?: string;

  @IsOptional() @IsDateString()
  fechaHasta?: string;
}