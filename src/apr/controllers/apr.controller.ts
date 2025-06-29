import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('apr')
export class AprController {
  @Get()
  async result(): Promise<AprDto> {
    await new Promise((r) => setTimeout(r, 3000));

    if (Math.random() < 0.5) {
      throw new HttpException('Random Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { apr: parseFloat(Math.random().toFixed(2)) };
  }
}
