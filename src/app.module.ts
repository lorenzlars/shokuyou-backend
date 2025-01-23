import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './common/interceptors/responseTransformInterceptor';
import { RemoveEmptyInterceptor } from './common/interceptors/removeEmptyInterceptor';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import * as mongoose from 'mongoose';
import { globalIdPlugin } from './mongoose/globalIdPlugin';
import { RecipesModule } from './recipes/recipes.module';
import { DataModule } from './data/data.module';
import { ProductsModule } from './products/products.module';
import { MealsModule } from './meals/meals.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        mongoose.plugin(globalIdPlugin);

        return {
          uri: configService.get('DATABASE_URL'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    DevtoolsModule.register({
      http: process.env.MODE === 'development',
    }),
    RecipesModule,
    AuthModule,
    UsersModule,
    IngredientsModule,
    TemplatesModule,
    DataModule,
    ProductsModule,
    MealsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveEmptyInterceptor,
    },
  ],
})
export class AppModule {}
