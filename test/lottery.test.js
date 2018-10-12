const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface,bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data : bytecode})
            .send({ from : accounts[0], gas : '1000000'});
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from : accounts[0],
      value : web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from : accounts[1],
      value : web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from : accounts[2],
      value : web3.utils.toWei('0.02', 'ether')
    });

    const player = await lottery.methods.getPlayers().call({
      from : accounts[0]
    });

    assert.equal(accounts[0], player[0]);
    assert.equal(accounts[1], player[1]);
    assert.equal(accounts[2], player[2]);
    assert.equal(3,player.length);
  });

  it('requires a minimum amount of ether to ether', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });
});
