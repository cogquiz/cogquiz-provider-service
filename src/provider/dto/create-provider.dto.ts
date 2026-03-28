import { IsEmail, IsEnum, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(['User', 'Provider'])
  role: string;

  @IsBoolean()
  @IsOptional()
  isPaticipant?: boolean;

  @IsNotEmpty()
  providerId: string;

  @IsBoolean()
  @IsOptional()
  viewResult?: boolean;
}
