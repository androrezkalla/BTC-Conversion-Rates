import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Conversions } from './Conversions';

describe('Conversions component', () => {
  it('renders the component', () => {
    render(<Conversions />);
    const btcElement = screen.getByText(/Conversions:/i);
    expect(btcElement).toBeInTheDocument();
  });

  it('performs the currency conversion correctly', () => {
    render(<Conversions />);
    const amountInput = screen.getByRole('spinbutton', { name: /fiat amount/i });
    const currencySelect = screen.getByLabelText(/fiat currency/i);
    const convertButton = screen.getByRole('button', { name: /convert to btc/i });
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(currencySelect, { target: { value: 'GBP' } });
    fireEvent.click(convertButton);
    const btcValue = screen.getByText(/is equal to (\d+\.\d+) BTC/i);
    expect(btcValue).toHaveTextContent('0.01614544 BTC');
  });
});
