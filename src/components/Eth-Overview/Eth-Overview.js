import React, { Component } from 'react';
import axios from 'axios';
import './eth-overview.css';
import { Card, Grid, Icon } from 'semantic-ui-react';

// import api key
const KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

const endpoint = `https://api.etherscan.io/api`;

class EthOverview extends Component {
  constructor() {
    super();
    this.state = {
      ethUSD: null,
      ethBTC: null,
      blockNo: null,
      latestBlock: 0,
      difficulty: null,
      marketCap: 0,
      timeStamp: null,
    };
  }

  async componentDidMount() {
    // retreive ETH price through api
    axios.get(endpoint + `?module=stats&action=ethprice&apikey=${KEY}`).then((res) => {
      const { result } = res.data;
      this.setState ({
        ethUSD: result.ethusd,
        ethBTC: result.ethbtc,
        timeStamp: result.ethusd_timestamp
      })
    });
  }
}
