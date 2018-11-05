import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        try {
            const requestCount = await campaign.methods.getRequestCount().call();
            if(requestCount > 0){
                const requests = await Promise.all(
                    Array(requestCount).fill().map((element,index) => {
                        return campaign.methods.requests(index).call();
                    })
                );
                console.log(requests);
            }
        } catch(err) {
            console.log(err.message);
        }
        
        return { address };
    }

    render () {
        return (
            <Layout>
                <h3>Request List</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>Add Request</Button>
                    </a>
                </Link>
            </Layout>
        );
    }
}

export default RequestIndex;