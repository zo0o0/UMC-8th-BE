import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserMyInfoResponse } from './dto/user-response.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ResponseMessage('내 정보 조회에 성공했습니다.')
  @Get('/me')
  @ApiOperation({
    summary: '내 정보 조회',
    description: '로그인한 사용자의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    type: UserMyInfoResponse,
  })
  async getMyInfo(@Request() req: any) {
    const userId = req.user.id;

    return await this.usersService.getMyInfo(userId);
  }
}
