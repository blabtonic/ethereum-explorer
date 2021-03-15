import React, { Component } from 'react';
import axios from 'axios';
import './eth-overview.css';

// import api key
const KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

const endpoint = `https://api.etherscan.io/api`;