import {
  Controller,
  Get,
  //   Post,
  Param,
  Delete,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
  //   UploadedFile,
  //   UploadedFiles,
  //   UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ImagesService } from './images.service';
import { Image } from './image.entity';

@Controller('images')
@UseGuards(AuthGuard())
export class ImagesController {
  private logger = new Logger('ImagesController');

  constructor(private imagesService: ImagesService) {}

  @Get()
  getImages(
    @Query(ValidationPipe) search: string,
    @GetUser() user: User,
  ): Promise<Image[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all images. Search query: ${search}`,
    );
    return this.imagesService.getImages(search, user);
  }

  @Get('/:id')
  getImageById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Image> {
    return this.imagesService.getImageById(id, user);
  }

  @Delete('/:id')
  deleteImage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.imagesService.deleteImage(id, user);
  }

  //   @Post('upload')
  //   @UseInterceptors(FileInterceptor('file'))
  //   uploadFile(@UploadedFile() file: Express.Multer.File) {
  //     console.log(file);
  //   }

  //   @Post('bulkUpload')
  //   @UseInterceptors(FilesInterceptor('files'))
  //   bulkUploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //     console.log(files);
  //   }
}
