import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { FiltrosOrdenDto } from './dto/filtros-orden.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WebhookGuard } from './webhook.guard';

@Controller('ordenes')
export class OrdenesController {
  constructor(private ordenesService: OrdenesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  crear(@Request() req, @Body() dto: CrearOrdenDto) {
    return this.ordenesService.crear(req.user.usuarioId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  obtenerTodas(@Request() req, @Query() filtros: FiltrosOrdenDto) {
    return this.ordenesService.obtenerTodas(req.user.usuarioId, filtros);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  obtenerPorId(@Request() req, @Param('id') id: string) {
    return this.ordenesService.obtenerPorId(req.user.usuarioId, id);
  }

  @Post(':id/webhook')
  @UseGuards(WebhookGuard)
  procesarWebhook(
    @Param('id') id: string,
    @Body() body: { estado: string; montoRecolectado?: number },
  ) {
    return this.ordenesService.procesarWebhook(id, body);
  }
}