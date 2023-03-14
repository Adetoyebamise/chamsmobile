import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  description: string;
  name: string;
  filename: string;
  views: string;
  isPublished: string;
}
