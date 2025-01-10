import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';
import { RecipeEntity } from './recipes/recipe.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity';
import { ImageEntity } from './images/image.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './common/interceptors/responseTransformInterceptor';
import { RemoveEmptyInterceptor } from './common/interceptors/removeEmptyInterceptor';
import { IngredientsModule } from './ingredients/ingredients.module';
import { IngredientEntity } from './ingredients/ingredient.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [UserEntity, RecipeEntity, ImageEntity, IngredientEntity],
        synchronize: true,
        ...(process.env.MODE === 'development'
          ? {}
          : {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }),
        extra: {
          max: 20,
        },
      }),
    }),
    RecipesModule,
    AuthModule,
    UsersModule,
    IngredientsModule,
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
