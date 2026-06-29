import {
  Controller, Get, Post, Patch, Body, Param, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // User: create order
  @Post()
  create(@CurrentUser() user: UserDocument, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user._id.toString(), dto);
  }

  // User: their own orders
  @Get('my')
  findMine(@CurrentUser() user: UserDocument) {
    return this.ordersService.findMyOrders(user._id.toString());
  }

  // Admin: all orders
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.ordersService.findAll();
  }

  // User or Admin: single order
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    const isAdmin = user.role === 'admin';
    return this.ordersService.findById(id, user._id.toString(), isAdmin);
  }

  // Admin: update order status
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
