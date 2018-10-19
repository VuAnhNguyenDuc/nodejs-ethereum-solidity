pragma solidity ^0.4.25;

contract Lottery {
    struct Board {
        address player;
        uint amount;
    }

    struct User {
        string name;
        address addr;
        string roles;
        string rights;
    }

    address public manager;
    address[] private players;
    address private winner;
    bool public hasWon = false;
    Board[] private board;
    User[] private users;

    constructor() public{
        manager = msg.sender;
        users.push(User({
            name : 'manager',
            addr : manager,
            roles : 'manager',
            rights : 'all'
            }));
    }

    function enter() public payable {
        require(msg.value > .001 ether);
        players.push(msg.sender);
        board.push(Board({
            player : msg.sender,
            amount : msg.value
            }));
        users.push(User({
            name : 'player',
            addr : msg.sender,
            roles : 'player',
            rights : 'read-only'
            }));
    }

    function random() private view returns(uint) {
        return uint(keccak256(block.difficulty,now,players));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        winner = players[index];
        hasWon = true;
        players = new address[](0);
    }

    function getBoardLength() public view returns (uint){
        return board.length;
    }

    function getBoardAt(uint index) public view returns (address, uint){
        return (board[index].player,board[index].amount);
    }

    function getUserLength() public view returns (uint){
        return users.length;
    }

    function getUser(uint index) public view returns (string, address, string, string){
        return (users[index].name,users[index].addr,users[index].roles,users[index].rights);
    }

    function getPlayers() public view returns (address[]){
        return players;
    }

    function getWinner() public view returns (address){
        return winner;
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
}
