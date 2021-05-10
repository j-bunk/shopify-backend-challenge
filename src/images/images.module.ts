import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ImageRepository } from './image.repository';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageRepository]), AuthModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
