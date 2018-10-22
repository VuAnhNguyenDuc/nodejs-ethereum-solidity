import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      manager : '',
      players : [],
      balance : '',
      value : '',
      message : '',
      hasWon : true,
      users : [],
      boards :[]
    };
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const hasWon = await lottery.methods.hasWon().call();
    const userLength = await lottery.methods.getUserLength().call();
    const boardLength = await lottery.methods.getBoardLength().call();

    let balance = await web3.eth.getBalance(lottery.options.address);
    balance = web3.utils.fromWei(balance, 'ether');

    App.getUsers(userLength).then(result => this.setState({
      users : result
    }));
    App.getBoard(boardLength).then(result => this.setState({
      boards : result
    }));

    this.setState({manager, players, balance, hasWon});
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({ message : 'Waiting for transaction...' });
    let existed = false;
    let players = this.state.players;
    for(let i = 0; i < players.length; i++){
      if(players[i] === accounts[0]){
        existed = true;
        break;
      }
    }
    if(!existed){
      await lottery.methods.enter().send({
        from : accounts[0],
        value : web3.utils.toWei(this.state.value,'ether')
      });
      this.setState({ message : 'You are now playing!' });
    } else{
      this.setState({ message : 'You have already entered the game!' });
    }
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message : 'Waiting for transaction' });

    await lottery.methods.pickWinner().send({
      from : accounts[0]
    });

    this.setState({ message : 'A winner has been picked'});
  };

  static async getUsers(userLength){
    const users = [];
    if(userLength > 0){
      for (let i = 0; i < userLength; i++){
        let user = await lottery.methods.getUser(i).call();
        users.push(
            {
              name : user[0],
              addr : user[1],
              roles : user[2],
              rights : user[3]
            });
      }
      return users;
    }
  }

  static async getBoard(boardLength){
    let boardObj = [];
    if(boardLength > 0){
      for(let i = 0; i < boardLength; i++){
        let board = await lottery.methods.getBoardAt(i).call();
        boardObj.push({
          player : board[0],
          amount : web3.utils.fromWei(board[1],'ether')
        });
      }
    }
    return boardObj;
  }

  render() {
    web3.eth.getAccounts().then();
    const board = this.state.boards.map((item) => {
      return (
        <tr key={item.player}>
          <td>{item.player}</td>
          <td>{item.amount} ether</td>
        </tr>
      );
    });

    const users = this.state.users.map((item) => {
      return (
          <tr key={item.addr}>
            <td>{item.name}</td>
            <td>{item.addr}</td>
            <td>{item.roles}</td>
            <td>{item.rights}</td>
          </tr>
      );
    });

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people competing to win about {this.state.balance} ether</p>
        <hr/>

        <p>Current Board : </p>
        <table>
          <thead>
            <tr>
              <td>Player's address</td>
              <td>Amount</td>
            </tr>
          </thead>
          <tbody>
            {board}
          </tbody>
        </table>
        <p>Current Users : </p>
        <table>
          <thead>
          <tr>
            <td>Name</td>
            <td>Address</td>
            <td>Role</td>
            <td>Rights</td>
          </tr>
          </thead>
          <tbody>
          {users}
          </tbody>
        </table>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
                onChange={event => this.setState({ value : event.target.value })}
                value = {this.state.value}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
