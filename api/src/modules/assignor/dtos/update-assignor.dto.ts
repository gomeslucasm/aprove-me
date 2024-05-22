import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateAssignorDto {
  @IsOptional()
  @IsString()
  @Length(1, 30)
  document?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 140)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 140)
  name?: string;
}
