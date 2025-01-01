import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private configService: ConfigService,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {
    const { username, password } = new URL(configService.get('CLOUDINARY_URL'));

    cloudinary.v2.config({
      secure: true,
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: username,
      api_secret: password,
    });
  }

  private async uploadImageFile(file: Express.Multer.File) {
    const uploadResponse = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        return cloudinary.v2.uploader
          .upload_stream(
            {
              resource_type: 'image',
              use_filename: true,
              transformation: { width: 250, height: 250, crop: 'limit' },
            },
            function (error, result) {
              if (error) {
                return reject(error);
              }

              return resolve(result);
            },
          )
          .end(file.buffer);
      },
    );

    if (!uploadResponse) {
      throw new Error('Failed to upload image');
    }

    return uploadResponse;
  }

  private async deleteImageFile(publicId: string) {
    return new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      return cloudinary.v2.uploader.destroy(publicId, (error, uploadResult) => {
        if (error) {
          return reject(error);
        }

        return resolve(uploadResult);
      });
    });
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException();
    }

    return image;
  }

  async addImage(file: Express.Multer.File): Promise<Image> {
    const uploadResponse = await this.uploadImageFile(file);

    return await this.imageRepository.save({
      publicId: uploadResponse.public_id,
      url: uploadResponse.url,
    });
  }

  async updateImage(id: string, file: Express.Multer.File) {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException();
    }

    const uploadResponse = await this.uploadImageFile(file);

    await this.deleteImageFile(image.publicId);

    return await this.imageRepository.save({
      ...image,
      publicId: uploadResponse.public_id,
      url: uploadResponse.url,
    });
  }

  async removeImage(id: string) {
    const image = await this.imageRepository.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException();
    }

    await this.deleteImageFile(image.publicId);

    const result = await this.imageRepository.delete(image.id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
