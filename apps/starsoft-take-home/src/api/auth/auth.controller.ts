import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './strategies/local/local.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { BasicResponseDto } from '../dto/basic-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshResponse } from './dto/resfresh-response.dto';
import { ReqUser } from '../users/users.decorator';
import { UsersService } from '../users/users.service';
import { UserPayload } from './user-payload.interface';
import { UserError } from '../../error/userError';

@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject()
  private jwtService: JwtService;

  @Inject()
  private authService: AuthService;

  @Inject()
  private usersService: UsersService;

  /**
   * Login into the api
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Post('/login')
  login(@Req() req: Request): LoginResponseDto {
    return {
      token: this.jwtService.sign({ ...req.user! }),
    };
  }

  /**
   * Register a new account.
   */
  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<BasicResponseDto> {
    await this.authService.registerUser(registerDto);

    return {
      message: 'Success',
    };
  }

  /**
   * Refresh the token for the current user
   */
  @Post('/refresh')
  @Public(false)
  @ApiBearerAuth()
  async refresh(@ReqUser() userPayload: UserPayload): Promise<RefreshResponse> {
    const user = await this.usersService.findById(userPayload.id);

    if (!user) {
      throw new UserError('User not found');
    }

    const payload = this.authService.payloadFromUser(user);

    return {
      token: this.jwtService.sign({ ...payload }),
    };
  }
}
