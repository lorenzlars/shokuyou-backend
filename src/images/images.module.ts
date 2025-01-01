import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImageEntity } from './image.entity';
import { ImagesService } from './images.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
