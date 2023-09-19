import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/module/auth.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { PostService } from './post/post.service';

@Module({
  imports: [AuthModule, PostModule],
  controllers: [AppController, PostController],
  providers: [AppService, PostService],
})
export class AppModule {}
