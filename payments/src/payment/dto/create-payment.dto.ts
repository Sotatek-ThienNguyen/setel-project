import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Length } from 'class-validator';
export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @ApiProperty()
    @IsInt()
    readonly price: number;

    @ApiProperty()
    @IsString()
    @Length(8, 8)
    @IsNotEmpty()
    readonly orderNumber: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    readonly createdBy: number;
}
