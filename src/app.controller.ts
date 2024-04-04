import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(): string {
    return this.appService.getHealth();
  }

  @Post()
  async getShortUrl(@Body() body: CreateShortUrlDto) {
    return this.appService.getShortUrl(body.originalUrl);
  }

  @Get('/:shortUrl')
  async getOriginalUrl(@Param('shortUrl') sort: string, @Res() res) {
    const result = await this.appService.getOriginalUrl(sort);
    return res.redirect(result);
  }
}
