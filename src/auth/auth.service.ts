import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async registrar(dto: { // objeto que agrupa todos los datos que llegan del formulario {Diccionario de diccionarios}
    nombre: string;
    apellido: string;
    sexo?: string;
    fechaNacimiento?: string;
    correo: string;
    telefono: string;
    codigoTelefono: string;
    contrasena: string;
  }) {

    //Metodo verificar si el email existe
    const existe = await this.prisma.user.findUnique({
      where: { email: dto.correo },
    });
    if (existe) throw new ConflictException('El correo ya está registrado');


    //Metodo que hashea la contraseña
    const hash = await bcrypt.hash(dto.contrasena, 10);

    //Metodo que guarda el usuario en la base de datos
    const usuario = await this.prisma.user.create({
      data: {
        firstName: dto.nombre,
        lastName: dto.apellido,
        gender: dto.sexo,
        birthDate: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null,
        email: dto.correo,
        phone: dto.telefono,
        phoneCode: dto.codigoTelefono,
        password: hash,
      },
    });

    //JWT son JSON Web Token 
    //Metodo que genera el token JWT
    //transmigd de forma segura de información entre 2 partes codificadas como un objeto JSON    

    //toma un objeto y lo convierte en un token encriptado
                        //⭥
    const token = this.jwt.sign({ sub: usuario.id, correo: usuario.email });
    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.firstName,
        correo: usuario.email,
      },
    };
  }

  // Método login
  async iniciarSesion(correo: string, contrasena: string) {
    // Metodo que va a MongoDB y busca algun usuario cuyo email sea igual al correo que llegó
    const usuario = await this.prisma.user.findUnique({
      where: { email: correo },
    });

    // Si no se encuentra un correo, lanza una excepción de credenciales inválidas
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    //bcrypt.compare compara la contraseña que llega con la contraseña hasheada que esta en mongo
    const valido = await bcrypt.compare(contrasena, usuario.password);
    //Si la contraseña no coincide lanza un error 
    if (!valido) throw new UnauthorizedException('Credenciales inválidas');

    //METODO que genera un token jwt con el id y el correo del usuario
    //sub es el ID y correo
    const token = this.jwt.sign({ sub: usuario.id, correo: usuario.email });
    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.firstName,
        correo: usuario.email,
      },
    };
  }
}