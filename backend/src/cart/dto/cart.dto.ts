import { IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsString() productId: string;
  @IsNumber() @Min(1) quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber() @Min(0) quantity: number;
}

export class MergeCartDto {
  items: { productId: string; name: string; price: number; imageUrl: string; quantity: number; stock: number }[];
}
