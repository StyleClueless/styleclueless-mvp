import React, {useState, useEffect, Component} from 'react'
import {withApollo} from "react-apollo";
import {ItemCard} from "../components/item-card";
import {global_company_id, renderS3UrlFromPrefix} from "../utils";
import {CardsWrapper} from "../components/cards-wrapper";
import {GET_TAGGING, GET_TAGGING_BY_CLASS} from "../hasura_qls";


class ItemsList extends Component {

    state = {items: []};

    async componentWillMount() {
        const {client} = this.props;
        const itemsType = this.props.match.params.itemsType;
        console.log(' rendering ItemsList for' + itemsType);

        try {
            const tagging =await this.getItems(client, itemsType);
            this.setState({items: tagging, itemsType});
        }
        catch (e) {
            console.error(e);
        }

    }

    getItems = async (client, itemsType) => {
        const {data} = await client.query({
            query: GET_TAGGING_BY_CLASS,
            variables: {company_id: global_company_id, class: itemsType},
            fetchPolicy: 'network-only',
        });
        console.log(data);
        const {tagging} = data;
        return tagging;
    }

  async  componentDidUpdate(prevProps, prevState, snapshot) {
        const itemsType = this.props.match.params.itemsType;
        console.log("componentDidUpdate " + itemsType);
        console.log("componentDidUpdate " + JSON.stringify(prevState));
        if (itemsType !== prevState.itemsType &&  prevState.items.length>=0) {
            const {client} = this.props;
            // window.location.href=this.props.match.url;
            const tagging =await this.getItems(client, itemsType);
            this.setState({items: tagging, itemsType});
        }
        // console.log("componentDidUpdate " +JSON.stringify(prevProps));
    }

    componentWillUnmount() {

    }

    render() {
        const {items, itemsType} = this.state;
        return (

            <div>

                <CardsWrapper>
                    {
                        items && items!==undefined && items.map(item => (
                            <ItemCard
                                key={item.id}
                                label={item.sku}
                                href={`/${itemsType}/${item.id}`}
                                // imgUrl={`${cloudinaryPath}/${dbClassMapping[itemsType]}/${item.code}.png`}
                                imgUrl={renderS3UrlFromPrefix(item.s3_url, 350)}
                            />
                        ))
                    }
                </CardsWrapper>
            </div>

        );
    }
}

export default withApollo(ItemsList);
//const cldTransformation = 'c_scale,h_350,q_auto:good'
// }
//   console.log('itemlist');
//   console.log(props);
//
//   const cloudinaryPath = envVars().CLOUDINARY_BASE_URL.replace('/upload', `/upload/${cldTransformation}`)
//   const [items, setItems] = useState(null)
//   const [loadedType, setLoadedType] = useState(null)
//   const { itemsType } = props.match.params
//
//   async function fetchData () {
//     const fetchBody={company_id:global_company_id,type: "Bottom"};
//       const {data:{tagging}} = await props.client.query({
//           query: GET_ALL_COMPANY_TAGGING_BY_TYPE,
//           variables: fetchBody,
//           fetchPolicy: 'network-only',
//       });
//       console.log(tagging);
//       setItems(tagging)
//       setLoadedType(itemsType)
//     // const res = await fetch(`/api/items?class=${dbClassMapping[itemsType]}`)
//     // setItems(await res.json())
//     // setLoadedType(itemsType)
//   }
//   useEffect(() => {
//     setLoadedType(null)
//     fetchData()
//   }, [itemsType])
//
//   return (

//   )
// }
