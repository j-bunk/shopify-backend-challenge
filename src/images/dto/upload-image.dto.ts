import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
