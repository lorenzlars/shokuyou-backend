import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/recipe.entity'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
        entities: [Recipe],
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
