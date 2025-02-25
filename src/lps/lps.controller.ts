import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message-decorator';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { CreateLpsDto } from 'src/lps/dto/create-lps.dto';
import { UpdateLpsDto } from 'src/lps/dto/update-lps.dto';
import { LpsService } from 'src/lps/lps.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('lps')
export class LpsController {
  constructor(private readonly lpsService: LpsService) {}

  @ResponseMessage('Lp 목록 조회에 성공했습니다.')
  @Get()
  @Public()
  async getLps(@Query() cursorPaginationDto: CursorPaginationDto) {
    return await this.lpsService.findAll(cursorPaginationDto);
  }

  @ResponseMessage('특정 유저가 생성한 Lp 목록 조회에 성공했습니다.')
  @Get('user/:userId')
  @Public()
  async getUserLps(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return await this.lpsService.findByUser({ cursorPaginationDto, userId });
  }

  @ResponseMessage('Lp 상세 조회에 성공했습니다.')
  @Get(':lpsId')
  @Public()
  async getLp(@Param('lpsId', ParseIntPipe) lpsId: number) {
    return await this.lpsService.findOne(lpsId);
  }

  @ResponseMessage('Lp 생성에 성공했습니다.')
  @Post()
  async createLp(@Request() req: any, @Body() createLpsDto: CreateLpsDto) {
    const userId = req.user.id;
    return await this.lpsService.create({ userId, createLpsDto });
  }

  @ResponseMessage('Lp 정보 업데이트에 성공했습니다.')
  @Patch(':lpsId')
  async updateLp(
    @Request() req: any,
    @Body() updateLpsDto: UpdateLpsDto,
    @Param('lpsId', ParseIntPipe) lpsId: number,
  ) {
    const userId = req.user.id;
    return await this.lpsService.update({ userId, lpsId, updateLpsDto });
  }

  @ResponseMessage('Lp 정보 삭제에 성공했습니다.')
  @Delete(':lpsId')
  async deleteLp(
    @Request() req: any,
    @Param('lpsId', ParseIntPipe) lpsId: number,
  ) {
    const userId = req.user.id;
    return await this.lpsService.delete({ userId, lpsId });
  }
}
