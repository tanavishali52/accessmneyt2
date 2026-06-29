import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(query: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, category, minPrice, maxPrice, sortBy = 'newest', page = 1, limit = 12 } = query;

    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = { $regex: `^${category}$`, $options: 'i' };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const sortMap: Record<string, any> = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
    };
    const sort = sortMap[sortBy] ?? { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(Number(limit)).exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      data: data.map((p) => p.toJSON()),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findRelated(id: string): Promise<ProductDocument[]> {
    const product = await this.findById(id);
    return this.productModel
      .find({ category: product.category, _id: { $ne: id } })
      .limit(4)
      .exec();
  }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    const product = new this.productModel(dto);
    return product.save();
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Product not found');
  }

  async count(): Promise<number> {
    return this.productModel.countDocuments().exec();
  }

  async insertMany(products: Partial<Product>[]): Promise<void> {
    await this.productModel.insertMany(products);
  }
}
