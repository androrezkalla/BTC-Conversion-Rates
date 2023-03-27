import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ConversionRates } from './ConversionRates';

describe('ConversionRates component', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should display current conversion rates', async () => {
    const btcData = {
      bpi: {
        USD: {
          rate: '$50,000',
          rate_float: 50000,
        },
        EUR: {
          rate: '€40,000',
          rate_float: 40000,
        },
        GBP: {
          rate: '£35,000',
          rate_float: 35000,
        },
      },
      time: {
        updatedISO: '2023-03-27T12:34:56.789Z',
      },
    };
    fetch.mockResponseOnce(JSON.stringify(btcData));

    render(<ConversionRates />);

    await waitFor(() => {
      expect(screen.getByText('$USD to BTC')).toBeInTheDocument();
      expect(screen.getByText('BTC to $USD')).toBeInTheDocument();
      expect(screen.getByText('€EUR to BTC')).toBeInTheDocument();
      expect(screen.getByText('BTC to €EUR')).toBeInTheDocument();
      expect(screen.getByText('£GBP to BTC')).toBeInTheDocument();
      expect(screen.getByText('BTC to £GBP')).toBeInTheDocument();
    });
  });

  it('should handle refresh button click', async () => {
    const btcData = {
      bpi: {
        USD: {
          rate: '$50,000',
          rate_float: 50000,
        },
        EUR: {
          rate: '€40,000',
          rate_float: 40000,
        },
        GBP: {
          rate: '£35,000',
          rate_float: 35000,
        },
      },
      time: {
        updatedISO: '2023-03-27T12:34:56.789Z',
      },
    };
    fetch.mockResponseOnce(JSON.stringify(btcData));

    render(<ConversionRates />);

    const refreshButton = screen.getByText('Refresh Data');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith('lastRefreshTime', expect.any(Number));
    });
  });
});

test('renders conversion rates table', async () => {
    render(<ConversionRates />);
    const usdToBtcElement = await screen.findByText(/USD to BTC/i);
    expect(usdToBtcElement).toBeInTheDocument();
  });
  