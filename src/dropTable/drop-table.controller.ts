import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Controller('drop-table')
export class DropTableController {
  constructor(private readonly entityManager: EntityManager) {}

  @Post()
  async dropTable(@Body() body: { tableName: string }): Promise<string> {
    const { tableName } = body;
    
    try {
      await this.entityManager.query(`DROP TABLE "${tableName}"`);
      return `Table '${tableName}' dropped successfully.`;
    } catch (error) {
      throw new BadRequestException(`Error dropping table '${tableName}': ${error.message}`);
    }
  }
}