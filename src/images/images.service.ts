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

  async addImage(file: Express.Multer.File): Promise<Image> {
    const uploadResponse = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        return cloudinary.v2.uploader
          .upload_stream(
            {
              resource_type: 'image',
              use_filename: true,
              eager: { width: 100, height: 100 },
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

    return await this.imageRepository.save({
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

    try {
      await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
        return cloudinary.v2.uploader.destroy(
          image.publicId,
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }

            return resolve(uploadResult);
          },
        );
      });
    } catch (error) {
      throw new Error('Failed to delete image');
    }

    const result = await this.imageRepository.delete(image.id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
