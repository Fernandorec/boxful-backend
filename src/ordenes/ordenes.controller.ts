import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { FiltrosOrdenDto } from './dto/filtros-orden.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ordenes')
@UseGuards(JwtAuthGuard)
export class OrdenesController {
  constructor(private ordenesService: OrdenesService) {}

  @Post()
  crear(@Request() req, @Body() dto: CrearOrdenDto) {
    return this.ordenesService.crear(req.user.usuarioId, dto);
  }

  @Get()
  obtenerTodas(@Request() req, @Query() filtros: FiltrosOrdenDto) {
    return this.ordenesService.obtenerTodas(req.user.usuarioId, filtros);
  }

  @Get(':id')
  obtenerPorId(@Request() req, @Param('id') id: string) {
    return this.ordenesService.obtenerPorId(req.user.usuarioId, id);
  }

  @Post(':id/webhook')
  procesarWebhook(
    @Param('id') id: string,
    @Body() body: { estado: string; montoRecolectado?: number },
  ) {
    return this.ordenesService.procesarWebhook(id, body);
  }
}