import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from "./file.entity";

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File) private fileRepository: Repository<File>,
    ) {
        
    }
    async uploadFile(file: Express.Multer.File)  {
        const newFile = await this.fileRepository.save({
            file: file.path
        });
        if(!newFile) {
            throw new Error('File not created');
        }
        return newFile;
    }
}