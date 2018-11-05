import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x8F38b30a6F36f0d853588Acd66ED33ff75a02F83'
);

export default instance;