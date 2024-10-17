import { IsEmail, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAlertDto {
  @ApiProperty({ enum: ['ethereum', 'polygon'] })
  @IsEnum(['ethereum', 'polygon'], { message: 'Chain must be ethereum or polygon' })
  chain: 'ethereum' | 'polygon';

  @ApiProperty({ example: 1000 })  
  @IsNumber()
  @Min(0, { message: 'Price must be greater than zero' })
  price: number;

  @ApiProperty({ example: 'user@example.com' })  
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
