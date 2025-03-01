import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from 'src/auth/guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth/google-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from './dto/auth-response.dto';
import { ResponseMessage } from '../common/decorators/response-message-decorator';
import {
  RefreshTokenRequestDto,
  SignInRequestDto,
} from './dto/auth-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description:
      '새로운 사용자를 등록합니다. name, email, password 필드는 필수적으로 필요합니다. bio 및 avatar(url)는 선택적으로 입력할 수 있습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: SignUpResponse,
  })
  @ApiBody({
    type: CreateUserDto,
  })
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({
    summary: '로그인',
    description: '로그인 성공 시, accessToken 및 refreshToken을 반환합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: SignInResponse,
  })
  @ApiBody({
    type: SignInRequestDto,
  })
  login(@Request() req: any) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @ApiBearerAuth()
  @Get('protected')
  getAll(@Request() req: any) {
    return `This is a protected route's content. User ID: ${req.user.id}`;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiBody({
    type: RefreshTokenRequestDto,
  })
  @ApiOperation({
    summary: '토큰 재발급',
    description:
      'body에 refreshToken을 전달하여 새로운 accessToken을 발급합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    type: SignInResponse,
  })
  refreshToken(@Request() req: any) {
    console.log('refreshToken');
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  // google authenticate page move
  @Get('google/login')
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Request() req: any, @Res() res) {
    const response = await this.authService.login(req.user.id, req.user.name);

    res.redirect(
      `http://localhost:5173/v1/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`,
    );
  }

  @ApiBearerAuth()
  @Post('signout')
  @ResponseMessage('로그아웃 성공')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: SignOutResponse,
  })
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }
}
