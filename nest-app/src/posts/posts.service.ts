import { Injectable } from '@nestjs/common';
import {
  InjectRepository,
  InjectEntityManager,
  InjectDataSource,
} from '@nestjs/typeorm';
// import { performance } from 'perf_hooks';
import { Repository, EntityManager, DataSource } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  // step I : initialized the data access layers in the constructor and then used them inside the methods
  constructor(
    @InjectRepository(Post) private postRepoitory: Repository<Post>,
    @InjectEntityManager() private postManager: EntityManager,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  create(createPostDto: CreatePostDto) {
    const newPost = this.postRepoitory.create(createPostDto);
    return this.postRepoitory.save(newPost);
    //'This action adds a new post'
  }

  async findAll() {
    await this.dataSource.createQueryBuilder(Post, 'post').getMany();

    const posts = this.postRepoitory.find();
    return posts;
    //`This action returns all posts`
  }

  async findOne(id: number) {
    const postWithRepository = await this.postRepoitory.findOneBy({ id });

    const postWithQueryBuilder = await this.postRepoitory
      .createQueryBuilder('post')
      .where('post.id= :postId', { postId: id })
      .getOne();

    const postFromEntityManager = await this.postManager
      .createQueryBuilder(Post, 'post')
      .where('post.id= :postId', { postId: id })
      .getOne();

    const postFromDataSource = await this.dataSource
      .createQueryBuilder()
      .select('post')
      .from(Post, 'post')
      .where('post.id= :postId', { postId: id })
      .getOne();

    return {
      postWithRepository,
      postWithQueryBuilder,
      postFromEntityManager,
      postFromDataSource,
    };
    //`This action returns a #${id} post`
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepoitory.findOneBy({ id });
    post.description = updatePostDto.description;
    const updatedPost = this.postRepoitory.save(post);
    return updatedPost;
    //`This action updates a #${id} post`
  }

  async remove(id: number) {
    const post = await this.postRepoitory.findOneBy({ id });
    const removedPost = this.postRepoitory.remove(post);
    return removedPost;
    //`This action removes a #${id} post`
  }
}
