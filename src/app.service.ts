import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { Url } from './entity/url.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    //
  }

  getHealth(): string {
    return 'OK';
  }

  async getShortUrl(originalUrl: string): Promise<string> {
    const existUrl = await this.dataSource.getRepository(Url).findOne({
      where: { originalUrl },
    });
    if (existUrl) {
      return `http://localhost:3000/${existUrl.shortUrl}`;
    }

    let path: string;
    while (true) {
      path = this.generateShortUrl(6);
      const existPath = await this.dataSource
        .getRepository(Url)
        .exists({ where: { shortUrl: path } });

      if (!existPath) {
        break;
      }
    }
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
    const cache = await this.cacheManager.get(shortUrl);
    if (cache) {
      return cache;
    }

    const url = await this.dataSource
      .getRepository(Url)
      .findOne({ where: { shortUrl } });

    if (url) {
      await this.cacheManager.set(shortUrl, url.originalUrl, 60 * 60);
      return url.originalUrl;
    }
    return 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
}
