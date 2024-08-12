import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './strategies/local/local.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { IsString } from 'class-validator';
import { ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

export class LoginResponse {
  @IsString()
  @ApiProperty()
  token: string;
}

@Public()
@Controller()
export class AuthController {
  @Inject()
  private jwtService: JwtService;

  @Inject()
  private authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  login(@Req() req: Request, @Body() _loginDto: LoginDto): LoginResponse {
    return {
      token: this.jwtService.sign({ ...req.user! }),
    };
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.registerUser(registerDto);

    return 'Success' as const;
  }
}
