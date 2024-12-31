import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Image } from './image.entity';
import { ImagesService } from './images.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Image])],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
