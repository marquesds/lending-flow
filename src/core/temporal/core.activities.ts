import axios from 'axios';

export async function getApr(): Promise<number> {
  const url = 'http://localhost:3000/apr';
  const result = (await axios.get(url)).data;
  return result.apr;
}

export async function sendAAN() {
  console.log(`Sending AAN. APR is above 0.5`);

  await new Promise((r) => setTimeout(r, 5000));

  if (Math.random() < 0.5) {
    throw new Error('Could not send AAN.');
  }
}

export async function acceptTerms() {
  console.log('The terms were accepted');
}

export async function depositLoan() {
  await new Promise((r) => setTimeout(r, 10000));
  console.log('Loan deposited');
}

export async function sendPayslips() {
  console.log('Sending payslips');
}
