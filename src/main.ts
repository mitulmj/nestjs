import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
const express = require('express');
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.use('/uploads/profile-photos',express.static(join(__dirname,'..','uploads/profile-photos')))
  await app.listen(3000);
}
bootstrap();
