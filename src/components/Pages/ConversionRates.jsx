import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ConversionRates = () => {
  const [btcData, setBtcData] = useState(null);
  const [fiatCurrency, setFiatCurrency] = useState('USD');
  const [fiatAmount, setFiatAmount] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      setBtcData(data);
    };
    fetchData();
  }, []);

  const handleConversion = () => {
    const rate = btcData.bpi[fiatCurrency].rate_float;
    const convertedValue = parseFloat(fiatAmount) / rate;
    setBtcValue(convertedValue);
  };

  const handleRefresh = () => {
    const currentTime = new Date().getTime();
    const lastRefreshTime = localStorage.getItem('lastRefreshTime');
    if (!lastRefreshTime || currentTime - lastRefreshTime >= 300000) {
      localStorage.setItem('lastRefreshTime', currentTime);
      setLastRefresh(currentTime);
      const fetchData = async () => {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json();
        setBtcData(data);
      };
      fetchData();
    } else {
      alert('You can only refresh once every 5 minutes!');
    }
  };

  const formatTime = (utcTime) => {
    const localTime = new Date(utcTime).toLocaleString();
    return `${localTime} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
  };

  return (
    <div>
      {btcData && (
        <div>
          <h2 id="current-rates">Current Conversion Rates</h2>
          <table className='conversion-table'>
            <tbody>
              <tr>
                <td>$USD to BTC</td>
                <td>{btcData.bpi.USD.rate}</td>
              </tr>
              <tr>
                <td>BTC to $USD</td>
                <td>{btcData.bpi.USD.rate_float.toFixed(2)}</td>
              </tr>
              <tr>
                <td>€EUR to BTC</td>
                <td>{btcData.bpi.EUR.rate}</td>
              </tr>
              <tr>
                <td>BTC to €EUR</td>
                <td>{btcData.bpi.EUR.rate_float.toFixed(2)}</td>
              </tr>
              <tr>
                <td>£GBP to BTC</td>
                <td>{btcData.bpi.GBP.rate}
            </td>
          </tr>
          <tr>
            <td>BTC to £GBP</td>
            <td>{btcData.bpi.GBP.rate_float.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      {btcData && lastRefresh && (
        <div>
        <p>Data and Time: {formatTime(btcData.time.updatedISO)}</p>
        <p>Last refreshed: {formatTime(lastRefresh)}</p>
      </div>
    )}
    {btcData && !lastRefresh && (
      <div>
        <p>Date and Time: {formatTime(btcData.time.updatedISO)}</p>
        <button onClick={handleRefresh}>Refresh Data</button>
      </div>
    )}
    </div>
    
  )}
</div>
  );
};
