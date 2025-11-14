import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GenerateTextDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxOutputTokens?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;
}
