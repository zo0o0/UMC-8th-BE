import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import {
  CommentListResponseDto,
  GetCommentsQueryDto,
} from './dto/comment-response.dto';

@ApiBearerAuth()
@ApiTags('comments')
@Controller('lps/:lpsId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ResponseMessage('댓글 목록 조회에 성공헀습니다.')
  @Get()
  @ApiQuery({ type: GetCommentsQueryDto })
  @ApiOperation({
    summary: '댓글 목록 조회',
    description: '특정 게시글(Lp)에 달린 댓글 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '댓글 목록 조회 성공',
    type: CommentListResponseDto,
  })
  async getComments(
    @Param('lpsId', ParseIntPipe) lpsId: number,
    @Query() cursorPaginationDto: Omit<CursorPaginationDto, 'search'>,
  ) {
    return await this.commentService.findAll(
      Number(lpsId),
      cursorPaginationDto,
    );
  }
}
