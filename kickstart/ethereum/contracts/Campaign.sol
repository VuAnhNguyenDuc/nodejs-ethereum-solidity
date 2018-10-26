pragma solidity ^0.4.25;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        require(minimum > 0, "The minimum contribution must be greater than 0");
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can execute this function!");
        _;
    }

    constructor (uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Please transfer an amount of money that is no less than the minimum contribution");
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description : description,
            value : value,
            recipient : recipient,
            complete : false,
            approvalCount : 0
            });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(msg.sender != manager, "You cannot approve your own request");
        require(approvers[msg.sender],"You can only approve this request if you have contributed");
        require(!request.approvals[msg.sender],"You have already appproved this request");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2),"This request has not yet received at least 50% approvals");
        require(!request.complete,"This request has already been finalized");
        require(request.value <= address(this).balance,"You don't have enough budget to finalize this request");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getTotalBalance() public view returns (uint){
        return address(this).balance;
    }

}
