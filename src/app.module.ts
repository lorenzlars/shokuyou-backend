import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/recipe.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Recipe],
        synchronize: true,
        ...(process.env.MODE === 'development'
          ? {}
          : {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }),
      }),
    }),
    RecipesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
