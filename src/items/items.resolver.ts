import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(@Args('createItemInput') createItemInput: CreateItemInput): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  async updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput): Promise<Item> {
    return this.itemsService.update(updateItemInput);
  }

  @Mutation(() => Item)
  async removeItem(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
