import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ORMConfig} from './configuration/configuration';
import { UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ORMConfig]
    }),
    TypeOrmModule.forRootAsync({
     inject: [ConfigService],
     useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      url: process.env.DB_URL,
      entities: [UserEntity],
      synchronize: true
     })
    }),
    
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
