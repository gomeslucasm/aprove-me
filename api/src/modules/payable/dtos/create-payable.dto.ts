import { IsUUID, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreatePayableDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsDateString()
  @IsNotEmpty()
  emissionDate: string;

  @IsUUID()
  @IsNotEmpty()
  assignor: string;
}
