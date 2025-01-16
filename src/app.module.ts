import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './common/interceptors/responseTransformInterceptor';
import { RemoveEmptyInterceptor } from './common/interceptors/removeEmptyInterceptor';
import { IngredientsModule } from './ingredients/ingredients.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PlansModule } from './plans/plans.module';
import { DataModule } from './data/data.module';
import { ProductsModule } from './products/products.module';
import { ScheduledMealsModule } from './scheduled_meals/scheduled_meals.module';

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
        autoLoadEntities: true,
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
        logging: process.env.MODE === 'development',
      }),
    }),
    DevtoolsModule.register({
      http: process.env.MODE === 'development',
    }),
    RecipesModule,
    AuthModule,
    UsersModule,
    IngredientsModule,
    PlansModule,
    DataModule,
    ProductsModule,
    ScheduledMealsModule,
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
