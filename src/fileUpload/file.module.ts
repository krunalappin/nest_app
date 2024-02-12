import { Module } from "@nestjs/common";
import { FileController } from "./file.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FileService } from "./file.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
              destination: './uploads',
              filename: (req, file, cb) => {
                const filename = Date.now().toString();
                cb(null, `${filename}-${file.originalname}`);
              },
            }),
          }),
        
        TypeOrmModule.forFeature([File]),
    ],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule { }