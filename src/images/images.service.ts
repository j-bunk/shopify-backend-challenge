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
    const image = await this.imageRepository.getImage(search, user);

    if (!image) {
      throw new NotFoundException(
        `Image with search criteria "${JSON.stringify(search)}" not found`,
      );
    }

    return image.imageName;
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

  async deleteImage(id: number, user: User): Promise<number> {
    const image = await this.imageRepository.delete({
      id,
      userId: user.id,
    });

    if (image.affected === 0) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }

    return id;
  }

  async uploadImage(
    user: User,
    imageName: string,
    uploadImageDto?: UploadImageDto,
  ): Promise<Image> {
    return this.imageRepository.uploadImage(user, imageName, uploadImageDto);
  }

  async bulkUploadImages(user: User, imageNames: string[]): Promise<Image[]> {
    return this.imageRepository.bulkUploadImages(user, imageNames);
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
