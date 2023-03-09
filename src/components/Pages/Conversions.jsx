import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Conversions = () => {
  const [btcData, setBtcData] = useState(null);
  const [fiatCurrency, setFiatCurrency] = useState('USD');
  const [fiatAmount, setFiatAmount] = useState('');
  const [btcValue, setBtcValue] = useState(null);
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
      <div>
        <h1>Conversions:</h1>
        <select value={fiatCurrency} onChange={(e) => setFiatCurrency(e.target.value)}>
          <option value="USD">$ (USD)</option>
          <option value="EUR">€ (EUR)</option>
          <option value="GBP">£ (GBP)</option>
        </select>
        <input type="number" value={fiatAmount} onChange={(e) => setFiatAmount(e.target.value)} />
        <button onClick={handleConversion}>Convert to BTC</button>
        {btcValue && <p>{`${fiatAmount} ${fiatCurrency} is equal to ${btcValue.toFixed(8)} BTC`}</p>}
      </div>
      {btcData && lastRefresh && (
        <div>
          <p>Data and Time: {formatTime(btcData.time.updatedISO)}</p>
          <p>Last refreshed: {formatTime(lastRefresh)}</p>
        </div>
      )}
      {btcData && !lastRefresh && (
        <div>
          <p>Data and Time: {formatTime(btcData.time.updatedISO)}</p>
          <button onClick={handleRefresh}>Refresh Data</button>
        </div>
      )}
      </div>
  );
};
