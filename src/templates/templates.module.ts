import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { RecipesModule } from '../recipes/recipes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
    RecipesModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [MongooseModule, TemplatesService],
})
export class TemplatesModule {}
