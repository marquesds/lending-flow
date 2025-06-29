import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TemporalClientService } from '../temporal/temporal.client';
import { uuid4 } from '@temporalio/workflow';
import { LendingDto } from '../dto/lending.dto';

@Controller('lending')
export class LendingController {
  constructor(private readonly temporalClientService: TemporalClientService) {}

  @Post('start')
  async startLendingWorkflow(@Body() body: LendingDto) {
    try {
      const workflowId = `lending-${uuid4()}`;
      await this.temporalClientService.startLendingWorkflow(body, workflowId);

      return { workflowId };
    } catch (error) {
      throw error;
    }
  }

  @Get('workflow/:workflowId/apr')
  async getApr(@Param('workflowId') workflowId: string) {
    const apr = await this.temporalClientService.getAprValue(workflowId);
    return { apr };
  }

  @Post('workflow/:workflowId/accept-terms')
  async acceptTerms(
    @Param('workflowId') workflowId: string,
    @Body() accepted: boolean,
  ) {
    await this.temporalClientService.acceptTerms(workflowId, accepted);
    return { accepted };
  }

  @Get('workflow/:workflowId/status')
  async getWorkflowStatus(@Param('workflowId') workflowId: string) {
    try {
      const status =
        await this.temporalClientService.getWorkflowStatus(workflowId);

      const result = {
        workflowId,
        status: status,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
}
