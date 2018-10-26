import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xFC98b83A4c56B30d9efD3eC82da02a294Ac3e9D4'
);

export default instance;