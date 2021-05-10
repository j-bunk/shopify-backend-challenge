import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ImagesService } from './images.service';
import { Image } from './image.entity';
import { UploadImageDto } from './dto/upload-image.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('images')
@UseGuards(AuthGuard())
export class ImagesController {
  private logger = new Logger('ImagesController');

  constructor(private imagesService: ImagesService) {}

  @Get()
  async getImage(
    @Query(ValidationPipe) search: string,
    @GetUser() user: User,
    @Res() res,
  ): Promise<Image> {
    this.logger.verbose(
      `User "${user.username}" retrieving image with search: ${JSON.stringify(
        search,
      )}`,
    );
    return res.sendFile(
      path.join(
        process.cwd(),
        'uploads/images/' + (await this.imagesService.getImage(search, user)),
      ),
    );
  }

  @Get('/:id')
  async getImageById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Res() res,
  ) {
    return res.sendFile(
      path.join(
        process.cwd(),
        'uploads/images/' + (await this.imagesService.getImageById(id, user)),
      ),
    );
  }

  @Delete('/:id')
  deleteImage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.imagesService.deleteImage(id, user);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadImage(
    @Body(ValidationPipe) uploadImageDto: UploadImageDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return this.imagesService.uploadImage(uploadImageDto, user, file.filename);
  }

  @Get('name/:imagename')
  async getImageByName(
    @Param('imagename') imageName: string,
    @GetUser() user: User,
    @Res() res,
  ): Promise<Image> {
    return res.sendFile(
      path.join(
        process.cwd(),
        'uploads/images/' +
          (await this.imagesService.getImageByName(imageName, user)),
      ),
    );
  }

  @Post('bulkupload')
  @UseInterceptors(FilesInterceptor('files', null, storage))
  bulkUploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser() user: User,
  ): Promise<Image[]> {
    const fileNames: string[] = files.map((file) => file.filename);
    return this.imagesService.bulkUploadImages(user, fileNames);
  }
}
