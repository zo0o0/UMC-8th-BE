import { IsOptional, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CursorPaginationDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsInt()
  cursor?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
