import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      // Permite levantar la API aunque la BD no este disponible en dev.
      // Endpoints que dependan de BD fallaran hasta que haya conexion.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Prisma] No se pudo conectar a la BD en startup.', error);
      } else {
        throw error;
      }
    }
  }
}
