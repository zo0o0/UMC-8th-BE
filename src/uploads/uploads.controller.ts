import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '이미지 업로드' }) // Swagger 설명
  @ApiConsumes('multipart/form-data') // FormData 형식 사용
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 파일 업로드 필드
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '요청이 성공했습니다.',
    schema: {
      example: {
        status: true,
        message: '요청이 성공했습니다.',
        statusCode: 201,
        data: {
          imageUrl: 'http://localhost:8000/uploads/1741127947806-552079898.png',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: this.uploadsService.getImageUrl(file.filename) };
  }
}
