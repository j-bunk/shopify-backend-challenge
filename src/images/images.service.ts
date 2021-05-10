import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ImageRepository } from './image.repository';
import { User } from '../auth/user.entity';
import { Image } from './image.entity';
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageRepository)
    private imageRepository: ImageRepository,
  ) {}

  async getImage(search: string, user: User): Promise<string> {
    return this.imageRepository.getImage(search, user);
  }

  async getImageById(id: number, user: User): Promise<string> {
    const image = await this.imageRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }

    return image.imageName;
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

  async uploadImage(
    uploadImageDto: UploadImageDto,
    user: User,
    imageName: string,
  ): Promise<Image> {
    return this.imageRepository.uploadImage(uploadImageDto, user, imageName);
  }

  async getImageByName(imageName: string, user: User): Promise<string> {
    const image = await this.imageRepository.findOne({
      where: { imageName, userId: user.id },
    });

    if (!image) {
      throw new NotFoundException(`Image with name "${imageName}" not found`);
    }

    return image.imageName;
  }
}
