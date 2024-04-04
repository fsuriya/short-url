import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateShortUrlDto {
  @Transform(({ value }) => value.trim())
  @IsUrl()
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  originalUrl: string;
}
