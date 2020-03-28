import React, { Component } from 'react';
import { withApollo,ApolloConsumer } from 'react-apollo';

import gql from 'graphql-tag';

class TestHasura extends Component {
    state = { dataProvider: null };

    async componentWillMount() {
        console.log('x');
        debugger;
         const TEST_QUERY = gql`
   query MyQuery {
  clients {
    created_at
    deleted
    email
    id
    password
    salt
    updated_at
    company_id
  }
}
`;
        const { data } = await this.props.client.query({
            query: TEST_QUERY,
            variables: { count_id: this.state.count_id },
            fetchPolicy: 'network-only',
        });
        console.log(data);
    }

    componentWillUnmount() {

    }

    render() {

        return (
            <div>
                <ApolloConsumer>

                </ApolloConsumer>
            </div>
        );
    }
}

export default withApollo(TestHasura);
