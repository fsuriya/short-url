import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Url } from './entity/url.entity';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {
    //
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getShortUrl(originalUrl: string): Promise<string> {
    const path = this.generateShortUrl(6);
    await this.dataSource.getRepository(Url).save({
      shortUrl: path,
      originalUrl,
    });
    return `http://localhost:3000/${path}`;
  }

  private generateShortUrl(length: number): string {
    const stringPool =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';
    for (let i = 0; i < length; i++) {
      shortUrl += stringPool.charAt(
        Math.floor(Math.random() * stringPool.length),
      );
    }
    return shortUrl;
  }

  async getOriginalUrl(shortUrl: string) {
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    //TODO: OK, so sorry for the rickroll, but I has to be done

    const url = await this.dataSource
      .getRepository(Url)
      .findOne({ where: { shortUrl } });
    return url ? url.originalUrl : 'Not found';
  }
}
