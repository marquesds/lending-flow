import {
  condition,
  defineQuery,
  defineSignal,
  proxyActivities,
  setHandler,
} from '@temporalio/workflow';
import type * as activities from './core.activities';

const { getApr, sendAAN, acceptTerms, depositLoan, sendPayslips } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
    retry: {
      backoffCoefficient: 2,
      initialInterval: '1 second',
      maximumAttempts: 10,
      maximumInterval: '15 seconds',
      nonRetryableErrorTypes: ['NotEnoughBalanceException'],
    },
  });

const getAprQuery = defineQuery<number>('getApr');
const acceptTermsSignal = defineSignal<[boolean]>('acceptTerms');

export async function lendingWorkflow(): Promise<number | null> {
  const aprValue = await getApr();

  setHandler(getAprQuery, () => aprValue);

  if (aprValue >= 0.5) {
    await sendAAN();
    return null;
  }

  let accepted = false;
  setHandler(acceptTermsSignal, (input) => {
    accepted = input;
  });
  await condition(() => accepted);
  await acceptTerms();

  await depositLoan();

  await sendPayslips();

  return aprValue;
}
