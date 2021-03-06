import React, { Component } from 'react';
import axios from 'axios';
import './eth-overview.css';
import { Card, Grid, Icon } from 'semantic-ui-react';
import LatestBlocks from '../Latest-Blocks/index';
import LatestTxs from '../Latest-Txs/index';

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
      blockTime: null,
      marketCap: 0,
      currentDate: null,
    };
  }

  async componentDidMount() {
    /* PRICE */
    // retreive ETH price through api
    axios.get(endpoint + `?module=stats&action=ethprice&apikey=${KEY}`).then((res) => {
      const { result } = res.data;
      this.setState(
        {
          ethUSD: result.ethusd,
          ethBTC: result.ethbtc,
          currentDate: result.ethusd_timestamp,
        },
        () => {
          // get market cap of ether in USD
          axios.get(endpoint + `?module=stats&action=ethsupply&apikey=${KEY}`).then((res) => {
            const { result } = res.data;
            // in wei
            const priceWei = result.toString();

            // in ether
            const priceEth = priceWei.slice(0, priceWei.length - 18);
            //console.log(result, priceWei, priceEth);
            // convert eth to USD
            this.setState({
              marketCap: parseInt(priceEth) * this.state.ethUSD,
            });
          });
        }
      );
    });
    /* End PRICE */

    /* BLOCK */
    // Retreive latest Block number
    axios.get(endpoint + `?module=proxy&action=eth_blockNumber&apikey=${KEY}`).then((res) => {
      this.setState({
        latestBlock: parseInt(res.data.result),
        blockNo: res.data.result, // block number is in hex
      });

      // get block difficulty
      axios
        .get(
          endpoint +
            `?module=proxy&action=eth_getBlockByNumber&tag=${res.data.result}&boolean=true&apikey=${KEY}`
        )
        .then((blockDetail) => {
          const { result } = blockDetail.data;

          // const blockTime = parseInt(result.timestamp).toString();
          // const blockUnix = blockTime;
          // const convertBlockTime = new Date(blockUnix * 1000);

          const difficulty = parseInt(result.difficulty).toString();

          const difficultyTH = `${difficulty.slice(0, 4)}.${difficulty.slice(4, 6)} TH`;

          this.setState({
            difficulty: difficultyTH,
          });

          //console.log('diff:' + difficulty, convertBlockTime.toLocaleString());
        });
    });
    /* END BLOCK */
  }

  getLatestBlocks = () => {
    if (this.state.latestBlock) {
      return <LatestBlocks latestBlock={this.state.latestBlock}></LatestBlocks>;
    }
  };

  getLatestTxs = () => {
    if (this.state.blockNo) {
      return <LatestTxs blockNo={this.state.blockNo}></LatestTxs>;
    }
  };

  render() {
    const { ethUSD, ethBTC, currentDate, difficulty, marketCap, latestBlock } = this.state;
    // convert unix timestamp to date
    const unixTime = currentDate;
    const dateConvert = new Date(unixTime * 1000);

    return (
      <div>
        {/* Move to header */}
        {dateConvert.toLocaleString()}
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: '#1A90df' }}>
                    <Icon name="ethereum"></Icon>ETHER PRICE
                  </Card.Header>
                  <Card.Description textAlign="left">
                    <Icon name="usd"></Icon>
                    {ethUSD} <Icon name="at"></Icon>
                    {ethBTC} <Icon name="bitcoin"></Icon>
                    <Icon name="clock"></Icon>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: '#1A90df' }}>
                    <Icon name="cube"></Icon>LATEST BLOCK
                  </Card.Header>
                  <Card.Description>{latestBlock}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: '#1A90df' }}>
                    <Icon name="setting"></Icon> DIFFICULTY
                  </Card.Header>
                  <Card.Description textAlign="left">{difficulty}</Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: '#1A90df' }}>
                    <Icon name="world"></Icon> MARKET CAP
                  </Card.Header>
                  <Card.Description textAlign="left">
                    <Icon name="usd"></Icon> {marketCap}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>{this.getLatestBlocks()}</Grid.Column>
            <Grid.Column>{this.getLatestTxs()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default EthOverview;
