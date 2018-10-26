import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and metamask has injected the web3 in to the browser
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are in the server OR metamask is not running
    // set up our own provider and use infura to run it
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/5257378d79fe44a08517fdf8c5e1893a'
    );
    web3 = new Web3(provider);
}

export default web3;

