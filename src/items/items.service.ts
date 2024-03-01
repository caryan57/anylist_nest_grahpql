import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    await this.itemsRepository.save(newItem);

    return newItem;
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find();
    return items;
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOne({ where: { id } });

    if(!item) throw new NotFoundException('No existe ese producto');

    return item;
  }

  async update(updateItemInput: UpdateItemInput): Promise<Item> {
    const itemToUpdate = await this.itemsRepository.preload(updateItemInput);

    if(!itemToUpdate) throw new NotFoundException('No existe ese producto');
    
    await this.itemsRepository.save(itemToUpdate);

    return itemToUpdate;
  }

  async remove(id: string): Promise<Item> {
    const itemToDelete = await this.findOne(id);
    itemToDelete.status = false;

    await this.itemsRepository.save(itemToDelete);

    return itemToDelete;
  }
}
