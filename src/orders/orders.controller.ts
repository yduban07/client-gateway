import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE} from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
      this.client.send({cmd: 'createOrder'}, createOrderDto)
      );
      return  order
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Get()
  async findAll(@Query() paginationDTO: OrderPaginationDto) {

    try {
    const orders = await firstValueFrom(
    this.client.send({cmd: 'findAllOrders'}, paginationDTO)//don't send null, doesn't work
    );
    return  orders
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
      this.client.send({cmd: 'findOneOrder'}, {id})
      );
      
      return order;
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
    ) {

    try {
      const order = await firstValueFrom(
       this.client.send({cmd: 'findAllOrders'}, {
        ...PaginationDto,
        status: statusDto.status
      })
      );
      
      return order;
      } catch (error) {
        throw new RpcException(error);
      }
  }


  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
    ) {
    try {
      const order = await firstValueFrom(
      this.client.send({cmd: 'changeOrderStatus'}, {id, status: statusDto.status})
      );
      return order;
      } catch (error) {
        throw new RpcException(error);
      }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
