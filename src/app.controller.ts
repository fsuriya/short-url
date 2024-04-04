import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async getShortUrl(@Body('originalUrl') originalUrl: string) {
    return this.appService.getShortUrl(originalUrl);
  }

  @Get('/:shortUrl')
  async getOriginalUrl(@Param('shortUrl') sort: string, @Res() res) {
    const result = await this.appService.getOriginalUrl(sort);
    return res.redirect(result);
  }
}
