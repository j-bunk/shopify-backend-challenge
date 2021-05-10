import { EntityRepository, Repository } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';

import { User } from '../auth/user.entity';
import { Image } from './image.entity';

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {
  private logger = new Logger('ImageRepository');

  async getImages(search: string, user: User): Promise<Image[]> {
    const query = this.createQueryBuilder('image');

    query.where('image.userId = :userId', { userId: user.id });

    if (search) {
      query.andWhere(
        '(image.title LIKE :search OR image.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const images = await query.getMany();
      return images;
    } catch (error) {
      this.logger.error(
        `Failed to get images for user "${user.username}". Search query: ${search}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
