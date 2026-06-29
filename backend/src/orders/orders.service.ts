import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    // Resolve product details + calculate total
    const items = [];
    let total = 0;
    for (const item of dto.items) {
      const product = await this.productsService.findById(item.productId);
      const lineTotal = product.price * item.quantity;
      total += lineTotal;
      items.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      });
    }

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      items,
      shippingAddress: dto.shippingAddress,
      total: Math.round(total * 100) / 100,
      status: 'pending',
      paymentStatus: 'pending',
    });
    return order.save();
  }

  async findMyOrders(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string, userId?: string, isAdmin = false): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    if (!isAdmin && order.userId.toString() !== userId) throw new ForbiddenException();
    return order;
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateStatus(id: string, status: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async count(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }
}
