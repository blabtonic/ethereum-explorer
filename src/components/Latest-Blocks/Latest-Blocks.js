import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react';
import axios from 'axios';

const KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
const endpoint = 'https://api.etherscan.io/api';

class LatestBlocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
    };
  }

  componentDidMount = () => {
    this.getBlocks();
  };

  getBlocks = async () => {
    const { latestBlock } = this.props;

    let blocks = [];

    for (let i = 0; i < 5; i = i + 1) {
      // retrieve block transaction
      const blockDetail = await axios.get(
        endpoint +
          `?module=proxy&action=eth_getBlockByNumber&tag=${(latestBlock - i).toString(
            16
          )}&boolean=true&apikey${KEY}`
      );

      const { result } = blockDetail.data;
      blocks.push(
        <Table.Row key={i}>
          <Table.Cell>
            <Label color="blue">bk</Label> {latestBlock - i}
          </Table.Cell>
          <Table.Cell>
            Miner {result.miner}
          </Table.Cell>
        </Table.Row>
      )
    }
  };

  render() {
    return (
      <Table fixed>
        <Table.Header>
          <Table.Row>
            <Table.Cell style={{ color: '#1A90df' }}>
              <h4>Latest Blocks</h4>
            </Table.Cell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{this.state.blocks}</Table.Body>
      </Table>
    );
  }
}

export default LatestBlocks;
