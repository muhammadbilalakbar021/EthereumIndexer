import { EthereumService } from './../service/ethereum.service';
import { Body, Controller, Post, Res, Get, Req, Query } from '@nestjs/common';
import { ResponseService } from 'src/utils/response/response.service';
import { Response } from 'express';

@Controller('ethereum')
export class EthereumController {
  constructor(
    private readonly ethereumService: EthereumService,
    public readonly responseService: ResponseService,
  ) {}

  @Get('getBlockNumber')
  async getCurrentBlockNumber(@Body() req: any, @Res() res: Response) {
    try {
      this.responseService.successResponse(
        true,
        await this.ethereumService.getBlockNumber(),
        res,
      );
    } catch (error) {
      this.responseService.serverFailureResponse(error.message, res);
    }
  }

  @Get('getBlock')
  async getCurrentBlock(@Query() req: any, @Res() res: Response) {
    try {
      this.responseService.successResponse(
        true,
        await this.ethereumService.getBlock(req.number),
        res,
      );
    } catch (error) {
      this.responseService.serverFailureResponse(error.message, res);
    }
  }
}
