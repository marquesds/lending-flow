import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@temporalio/client';
import { lendingWorkflow } from './core.workflows';
import { LendingDto } from '../dto/lending.dto';

@Injectable()
export class TemporalClientService {
  private client: Client;
  private readonly logger = new Logger(TemporalClientService.name);

  constructor() {
    this.client = new Client({
      namespace: 'default',
    });
  }

  async startLendingWorkflow(
    lending: LendingDto,
    workflowId: string,
  ): Promise<string> {
    try {
      this.logger.log('TemporalClientService: Starting lending workflow');

      await this.client.workflow.start(lendingWorkflow, {
        args: [],
        taskQueue: 'lending-queue',
        workflowId: workflowId,
      });

      this.logger.log('TemporalClientService: Workflow started', {
        workflowId: workflowId,
        lending: lending,
      });

      return workflowId;
    } catch (error) {
      this.logger.error(
        'TemporalClientService: Failed to start or execute workflow',
        error,
      );
      throw error;
    }
  }

  async getAprValue(workflowId: string): Promise<number> {
    const handle = this.client.workflow.getHandle(workflowId);
    const apr = await handle.query<number>('getApr');
    return apr;
  }

  async acceptTerms(workflowId: string, accepted: boolean) {
    const handle = this.client.workflow.getHandle(workflowId);
    await handle.signal('acceptTerms', accepted);
  }

  async getWorkflowStatus(workflowId: string) {
    try {
      const handle = this.client.workflow.getHandle(workflowId);
      const result = await handle.describe();
      return result.status.name;
    } catch (error) {
      this.logger.error(
        'TemporalClientService: Failed to get workflow status',
        error,
      );
      throw error;
    }
  }
}
