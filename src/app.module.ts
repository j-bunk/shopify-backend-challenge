import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ImagesModule, AuthModule],
})
export class AppModule {}
