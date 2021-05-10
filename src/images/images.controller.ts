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
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { ImagesService } from './images.service';
import { Image } from './image.entity';
import { UploadImageDto } from './dto/upload-image.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { FilesUploadDto } from './dto/files-upload.dto';

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

@ApiBearerAuth()
@ApiTags('images')
@Controller('images')
@UseGuards(AuthGuard())
export class ImagesController {
  private logger = new Logger('ImagesController');

  constructor(private imagesService: ImagesService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
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
  ): Promise<number> {
    return this.imagesService.deleteImage(id, user);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file', storage))
  uploadImage(
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
    @Body() uploadImageDto?: UploadImageDto,
  ): Promise<Image> {
    return this.imagesService.uploadImage(user, image.filename, uploadImageDto);
  }

  @Get('/:imagename')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', null, storage))
  bulkUploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser() user: User,
  ): Promise<Image[]> {
    const fileNames: string[] = files.map((file) => file.filename);
    return this.imagesService.bulkUploadImages(user, fileNames);
  }
}
