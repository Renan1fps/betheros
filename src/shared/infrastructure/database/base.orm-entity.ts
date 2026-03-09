import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();
}
