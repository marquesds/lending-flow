import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Worker } from '@temporalio/worker';
import {
  acceptTerms,
  depositLoan,
  getApr,
  sendAAN,
  sendPayslips,
} from './core.activities';

@Injectable()
export class TemporalWorkerService implements OnModuleInit, OnModuleDestroy {
  private worker: Worker | null = null;
  private workerStartPromise: Promise<void> | null = null;
  private isInitializing = false;
  private readonly logger = new Logger(TemporalWorkerService.name);

  constructor() {}

  async onModuleInit() {
    // Start the worker asynchronously without blocking module initialization
    this.isInitializing = true;
    this.workerStartPromise = this.startWorkerAsync();

    // Don't await the promise - let it run in the background
    this.workerStartPromise.catch((error) => {
      this.logger.error('TemporalWorkerService: Worker failed to start', error);
    });
  }

  private async startWorkerAsync(): Promise<void> {
    try {
      this.logger.log('TemporalWorkerService: Starting Temporal worker...');

      this.worker = await Worker.create({
        workflowsPath: require.resolve('./core.workflows'),
        activities: {
          getApr: getApr,
          sendAAN: sendAAN,
          acceptTerms: acceptTerms,
          depositLoan: depositLoan,
          sendPayslips: sendPayslips,
        },
        taskQueue: 'lending-queue',
        maxConcurrentActivityTaskExecutions: 50,
        maxConcurrentWorkflowTaskExecutions: 10,
      });

      await this.worker.run();
      this.logger.log(
        'TemporalWorkerService: Temporal worker started successfully',
      );
    } catch (error) {
      this.logger.error(
        'TemporalWorkerService: Failed to start Temporal worker',
        error,
      );
      throw error;
    }
  }

  // Optional: Method to check if worker is ready
  async isWorkerReady(): Promise<boolean> {
    if (!this.isInitializing) {
      return false;
    }

    try {
      await this.workerStartPromise;
      return this.worker !== null;
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.worker) {
      this.logger.log(
        'TemporalWorkerService: Shutting down Temporal worker...',
      );
      await this.worker.shutdown();
      this.logger.log(
        'TemporalWorkerService: Temporal worker shut down successfully',
      );
    }
  }
}
