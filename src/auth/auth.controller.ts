import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registro')
  registrar(
    @Body()
    body: {
      nombre: string;
      apellido: string;
      sexo?: string;
      fechaNacimiento?: string;
      correo: string;
      telefono: string;
      codigoTelefono: string;
      contrasena: string;
    },
  ) {
    return this.authService.registrar(body);
  }

  @Post('login')
  iniciarSesion(@Body() body: { correo: string; contrasena: string }) {
    return this.authService.iniciarSesion(body.correo, body.contrasena);
  }
}