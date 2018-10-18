import Web3 from 'web3';

// rip out the old web3 of meta mask on browser
const web3 = new Web3(window.web3.currentProvider);

export default web3;

