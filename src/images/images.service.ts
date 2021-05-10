import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageRepository } from './image.repository';
import { User } from '../auth/user.entity';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageRepository)
    private imageRepository: ImageRepository,
  ) {}

  async getImages(search: string, user: User): Promise<Image[]> {
    return this.imageRepository.getImages(search, user);
  }

  async getImageById(id: number, user: User): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }

    return image;
  }

  async deleteImage(id: number, user: User): Promise<void> {
    const image = await this.imageRepository.delete({
      id,
      userId: user.id,
    });

    if (image.affected === 0) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }
  }
}
