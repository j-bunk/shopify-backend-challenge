import { EntityRepository, Repository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';

import { User } from '../auth/user.entity';
import { Image } from './image.entity';
import { UploadImageDto } from './dto/upload-image.dto';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  private logger = new Logger('ImageRepository');

  async getImage(search: string, user: User): Promise<Image> {
    const query = this.createQueryBuilder('image');

    query.where('image.userId = :userId', { userId: user.id });

    if (search.length) {
      query.andWhere(
        '(image.title LIKE :search OR image.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const image = await query.getOne();
      return image;
    } catch (error) {
      this.logger.error(
        `Failed to get images for user "${
          user.username
        }". Search query: ${JSON.stringify(search)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async uploadImage(
    user: User,
    imageName: string,
    uploadImageDto?: UploadImageDto,
  ): Promise<Image> {
    const { title, description } = uploadImageDto;

    const image = new Image();
    image.title = title;
    image.description = description;
    image.imageName = imageName;
    image.user = user;

    try {
      await image.save();
    } catch (error) {
      this.logger.error(
        `Failed to upload image for user "${user.username}". Data: ${uploadImageDto}, ${imageName}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete image.user;
    return image;
  }

  async bulkUploadImages(user: User, imageNames: string[]): Promise<Image[]> {
    const imageNamesLength = imageNames.length;
    const images = [];
    for (let i = 0; i < imageNamesLength; i++) {
      const image = new Image();
      image.imageName = imageNames[i];
      image.user = user;

      try {
        await image.save();
      } catch (error) {
        this.logger.error(
          `Failed to upload image for user "${user.username}". Data: ${imageNames[i]}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }

      delete image.user;
      images.push(image);
    }

    return images;
  }
}
