import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ImageEntity } from './image.entity';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private configService: ConfigService,

    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
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

  async addImage(
    file: Express.Multer.File,
    entityManager?: EntityManager,
  ): Promise<ImageEntity> {
    const repo = entityManager
      ? entityManager.getRepository(ImageEntity)
      : this.imageRepository;

    const uploadResponse = await this.uploadImageFile(file);

    return await repo.save({
      publicId: uploadResponse.public_id,
      url: uploadResponse.url,
    });
  }

  async updateImage(
    id: string,
    file: Express.Multer.File,
    entityManager?: EntityManager,
  ) {
    const repo = entityManager
      ? entityManager.getRepository(ImageEntity)
      : this.imageRepository;

    const image = await repo.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException();
    }

    const uploadResponse = await this.uploadImageFile(file);

    await this.deleteImageFile(image.publicId);

    return await repo.save({
      ...image,
      publicId: uploadResponse.public_id,
      url: uploadResponse.url,
    });
  }

  async removeImage(id: string, entityManager?: EntityManager) {
    const repo = entityManager
      ? entityManager.getRepository(ImageEntity)
      : this.imageRepository;

    const image = await repo.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException();
    }

    await this.deleteImageFile(image.publicId);

    const result = await repo.delete({ id: image.id });

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
