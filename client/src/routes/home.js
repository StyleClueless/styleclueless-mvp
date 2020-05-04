import React, {Component} from 'react'
import {categories, dbClassMapping} from '../categories-config'
import {ItemCard} from '../components/item-card'
import {CardsWrapper} from '../components/cards-wrapper'
import {envVars} from '../util/env-vars'
import {GET_TAGGING, GET_TAGGING_URLS} from "../hasura_qls";
import {global_company_id, renderS3UrlFromPrefix, splitToArrayOfSize2} from "../utils";
import {withApollo} from "react-apollo";


class Home extends Component {

    state = {items: [], item_dict: {}}

    async componentWillMount() {
        console.log('HOME');
        const comapany_id = localStorage.getItem('styleClueLessCompanyId')
        if (comapany_id === null) {
            this.props.history.push('/login');
        }
        const {client} = this.props;
        try {
            const {data} = await client.query({
                query: GET_TAGGING_URLS,
                variables: {company_id: comapany_id},
                fetchPolicy: 'network-only',
            });
            console.log(data);
            const {tagging} = data;
            let result = {};
            tagging.forEach(item => {
                result[item['class']] = item;
            })
            this.setState({items: tagging, item_dict: result});
        }
        catch (e) {
            console.error(e);
        }

    }

    componentWillUnmount() {

    }

    renderRowOfTwo = (array_of_two, item_dict) => {
        return ( array_of_two.map(cat => {
           return this.renderItemCard(cat, item_dict)
        })
        )
    }
    renderItemCard = (cat, item_dict) => {
        debugger;
        return (

            <ItemCard
                key={cat}
                href={`/store/${cat.toLowerCase()}`}
                // imgUrl={`${cloudinaryPath}/${dbClassMapping[cat.toLowerCase()]}/cover.png`}
                // imgUrl={item_dict && Object.keys(item_dict).length > 0 && item_dict[cat] !== undefined ? renderS3UrlFromPrefix(item_dict[cat].png_s3_url) : ''}
                imgUrl={item_dict && Object.keys(item_dict).length > 0 && item_dict[cat] !== undefined ? renderS3UrlFromPrefix(item_dict[cat].s3_url) : ''}
                label={cat}
            />
        )

    }

    render() {
        const {items, itemsType, item_dict} = this.state;
        return (

            <div className='products '>
                {categories && categories.length  > 0  && Object.keys(item_dict).length>0&& splitToArrayOfSize2(categories).map(cat_of_two => (

                        <div className='row flex justify-center'>

                          {this.renderRowOfTwo(cat_of_two, item_dict)}
                        </div>

                    )
                )
                }
            </div>

        );
    }
}

export default withApollo(Home);
