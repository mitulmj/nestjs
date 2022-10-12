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
  app.use('/uploads/business-photos',express.static(join(__dirname,'..','uploads/business-photos')))
  app.use('/uploads/business-types',express.static(join(__dirname,'..','uploads/business-types')))
  app.use('/uploads/utility-photos',express.static(join(__dirname,'..','uploads/utility-photos')))
  await app.listen(5000);
}
bootstrap();
