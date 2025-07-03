import axios from 'axios';
import { getApr, sendAAN, acceptTerms, depositLoan, sendPayslips } from '../core.activities';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Core Activities', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('getApr', () => {
    it('should return APR value from API response', async () => {
      const mockAprValue = 0.45;
      mockedAxios.get.mockResolvedValue({
        data: { apr: mockAprValue }
      });

      const result = await getApr();

      expect(result).toBe(mockAprValue);
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/apr');
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedAxios.get.mockRejectedValue(error);

      await expect(getApr()).rejects.toThrow('API Error');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/apr');
    });
  });

  describe('sendAAN', () => {
    beforeEach(() => {
      jest.spyOn(global, 'setTimeout').mockImplementation((callback, delay) => {
        if (typeof callback === 'function') {
          callback();
        }
        return setTimeout(() => {}, 0);
      });
      jest.spyOn(Math, 'random').mockRestore();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should send AAN successfully when random is >= 0.5', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.6);

      await expect(sendAAN()).resolves.toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Sending AAN. APR is above 0.5');
    });

    it('should throw error when random is < 0.5', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3);

      await expect(sendAAN()).rejects.toThrow('Could not send AAN.');
      expect(console.log).toHaveBeenCalledWith('Sending AAN. APR is above 0.5');
    });

    it('should wait for 5 seconds before processing', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.6);
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      await sendAAN();

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    });
  });

  describe('acceptTerms', () => {
    it('should log acceptance message', async () => {
      await acceptTerms();

      expect(console.log).toHaveBeenCalledWith('The terms were accepted');
    });
  });

  describe('depositLoan', () => {
    beforeEach(() => {
      jest.spyOn(global, 'setTimeout').mockImplementation((callback, delay) => {
        if (typeof callback === 'function') {
          callback();
        }
        return setTimeout(() => {}, 0);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should deposit loan after waiting', async () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      await depositLoan();

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 10000);
      expect(console.log).toHaveBeenCalledWith('Loan deposited');
    });
  });

  describe('sendPayslips', () => {
    it('should log payslips message', async () => {
      await sendPayslips();

      expect(console.log).toHaveBeenCalledWith('Sending payslips');
    });
  });
}); 