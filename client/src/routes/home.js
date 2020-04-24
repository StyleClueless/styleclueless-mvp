import React, {Component} from 'react'
import { categories, dbClassMapping } from '../categories-config'
import { ItemCard } from '../components/item-card'
import { CardsWrapper } from '../components/cards-wrapper'
import { envVars } from '../util/env-vars'
import {GET_TAGGING, GET_TAGGING_URLS} from "../hasura_qls";
import {global_company_id, renderS3UrlFromPrefix} from "../utils";
import {withApollo} from "react-apollo";


class Home extends Component {

    state = { items: [],item_dict:{}}

    async componentWillMount() {
        console.log('HOME');
        const comapany_id=localStorage.getItem('styleClueLessCompanyId')
        if(comapany_id===null){
            this.props.history.push('/login');
        }
        const {client}=this.props;
        try {
            const {data} = await client.query({
                query: GET_TAGGING_URLS,
                variables: {company_id:comapany_id},
                fetchPolicy: 'network-only',
            });
            console.log(data);
            const {tagging}=data;
            let result={};
            tagging.forEach(item=>{
                result[item['class']]=item;
            })
            this.setState({items:tagging,item_dict:result});
        }
        catch (e) {
            console.error(e);
        }

    }

    componentWillUnmount() {

    }

    render() {
        const {items,itemsType,item_dict} = this.state;
        return (

            <CardsWrapper>
                {categories.map(cat => (
                    <ItemCard
                        key={cat}
                        href={`/store/${cat.toLowerCase()}`}
                        // imgUrl={`${cloudinaryPath}/${dbClassMapping[cat.toLowerCase()]}/cover.png`}
                        imgUrl={item_dict&&Object.keys(item_dict).length>0&&item_dict[cat]!==undefined?renderS3UrlFromPrefix(item_dict[cat].s3_url):''}
                        label={cat}
                    />
                ))}
            </CardsWrapper>

        );
    }
}

export default withApollo(Home);
