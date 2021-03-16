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
    /* PRICE */
    // retreive ETH price through api
    axios.get(endpoint + `?module=stats&action=ethprice&apikey=${KEY}`).then((res) => {
      const { result } = res.data;
      this.setState(
        {
          ethUSD: result.ethusd,
          ethBTC: result.ethbtc,
          timeStamp: result.ethusd_timestamp,
        },
        () => {
          // get market cap of ether in USD
          axios.get(endpoint + `?module=stats&action=ethsupply&apikey=${KEY}`).then((res) => {
            const { result } = res.data;
            // in wei
            const priceWei = result.toString();

            //in ether
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

          const difficulty = parseInt(result.difficulty).toString();

          console.log(difficulty);
        });
    });
    /* END BLOCK */
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: '#1e90ff' }}>
                    <Icon name="ethereum"></Icon>ETHER PRICE
                  </Card.Header>
                  <Card.Description textAlign="left"></Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default EthOverview;
