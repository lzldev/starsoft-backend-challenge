import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MinLength(3, {
    message: 'Username is too short it should be at least 3 characters long',
  })
  @MaxLength(30, {
    message: 'Username is too long',
  })
  username: string;

  @IsString()
  @MinLength(5, {
    message: 'Password is too short',
  })
  @MaxLength(30, {
    message: 'Password is too long',
  })
  password: string;

  @IsEmail()
  email: string;
}
