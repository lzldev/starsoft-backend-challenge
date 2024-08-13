import { Body, Controller, Inject, Param, Put } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReqUser } from './users.decorator';
import { UsersService } from './users.service';
import { BasicResponseDto } from '../dto/basic-response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from './roles/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UserError } from '../../error/userError';
import { UserPayload } from '../auth/user-payload.interface';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  @Inject()
  private usersService: UsersService;

  @Put()
  async updateSelf(
    @Body() updateUserDto: UpdateUserDto,
    @ReqUser() user: UserPayload,
  ): Promise<BasicResponseDto> {
    await this.usersService.updateUser(user.id, updateUserDto);

    return {
      message: 'User Updated',
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BasicResponseDto> {
    const result = await this.usersService.updateUser(userId, updateUserDto);

    if (result.affected !== 1) {
      throw new UserError('User does not Exist');
    }

    return {
      message: 'User Updated',
    };
  }
}
