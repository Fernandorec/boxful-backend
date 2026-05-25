import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearOrdenDto } from './dto/crear-orden.dto';
import { FiltrosOrdenDto } from './dto/filtros-orden.dto';

@Injectable()
export class OrdenesService {
  constructor(private prisma: PrismaService) {}

  async crear(usuarioId: string, dto: CrearOrdenDto) {
    const diaSemana = new Date().getDay();

    const costoEnvio = await this.prisma.shippingCost.findFirst({
      where: { dayOfWeek: diaSemana },
    });

    const costo = costoEnvio?.baseCost ?? 3.00;

    const orden = await this.prisma.order.create({
      data: {
        userId: usuarioId,
        pickupAddress: dto.direccionRecoleccion,
        scheduledDate: new Date(dto.fechaProgramada),
        recipientFirstName: dto.nombreDestinatario,
        recipientLastName: dto.apellidoDestinatario,
        recipientEmail: dto.correoDestinatario,
        recipientPhone: dto.telefonoDestinatario,
        recipientAddress: dto.direccionDestinatario,
        department: dto.departamento,
        municipality: dto.municipio,
        reference: dto.referencia,
        instructions: dto.indicaciones,
        isCOD: dto.esCOD ?? false,
        expectedAmount: dto.montoEsperado ? parseFloat(String(dto.montoEsperado)) : null,
        shippingCost: costo,
        packages: {
          create: dto.paquetes.map((p) => ({
            content: p.contenido,
            weightLbs: p.pesoLibras,
            width: p.ancho,
            height: p.alto,
            length: p.largo,
          })),
        },
      },
      include: { packages: true },
    });

    return orden;
  }

  async obtenerTodas(usuarioId: string, filtros: FiltrosOrdenDto) {
    const donde: any = { userId: usuarioId };

    if (filtros.estado) {
      donde.status = filtros.estado;
    }

    if (filtros.esCOD !== undefined) {
      donde.isCOD = filtros.esCOD;
    }

    if (filtros.nombreDestinatario) {
      donde.recipientFirstName = {
        contains: filtros.nombreDestinatario,
        mode: 'insensitive',
      };
    }

    if (filtros.fechaDesde || filtros.fechaHasta) {
      donde.createdAt = {};
      if (filtros.fechaDesde) {
        donde.createdAt.gte = new Date(filtros.fechaDesde);
      }
      if (filtros.fechaHasta) {
        donde.createdAt.lte = new Date(filtros.fechaHasta);
      }
    }

    return this.prisma.order.findMany({
      where: donde,
      orderBy: { createdAt: 'desc' },
      include: { packages: true },
    });
  }

  async obtenerPorId(usuarioId: string, ordenId: string) {
    const orden = await this.prisma.order.findFirst({
      where: { id: ordenId, userId: usuarioId },
      include: { packages: true },
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');

    return orden;
  }

  async procesarWebhook(ordenId: string, dto: { estado: string; montoRecolectado?: number }) {
    const orden = await this.prisma.order.findUnique({
      where: { id: ordenId },
    });

    if (!orden) throw new NotFoundException('Orden no encontrada');

    const montoRecolectado = dto.montoRecolectado ?? 0;
    let liquidacion: number;
    let comision = 0;

    if (orden.isCOD && montoRecolectado > 0) {
      comision = Math.min(montoRecolectado * 0.0001, 25);
      liquidacion = montoRecolectado - (orden.shippingCost ?? 0) - comision;
    } else {
      liquidacion = -(orden.shippingCost ?? 0);
    }

    return this.prisma.order.update({
      where: { id: ordenId },
      data: {
        status: dto.estado,
        collectedAmount: montoRecolectado,
        commission: comision,
        settlementAmount: liquidacion,
      },
    });
  }
}