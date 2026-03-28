import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class AddNewParticipant {
  @IsNotEmpty()
  providerId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  viewResult: boolean;
}
