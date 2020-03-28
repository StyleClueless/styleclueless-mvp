import React, { Component } from 'react';
import { withApollo,ApolloConsumer } from 'react-apollo';

import gql from 'graphql-tag';

class TestHasura extends Component {
    state = { dataProvider: null };

    async componentWillMount() {
        console.log('x');
        debugger;
         const TEST_QUERY = gql`
    query getHishGadLogsByCountId($count_id: uuid!) {
        hishgad_logs(where: { count_id: { _eq: $count_id } }) {
            client_id
            count_id
            created_at
            deleted
            first_card
            id
            opened
            second_card
            updated_at
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
