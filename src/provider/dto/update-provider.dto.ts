import { IsOptional, IsString } from 'class-validator';

export class UpdateProviderDto {
  @IsString()
  @IsOptional()
  code?: string;
}
