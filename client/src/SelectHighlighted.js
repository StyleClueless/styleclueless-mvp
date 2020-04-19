
import React from 'react'
import styles from './tagging_colors.css';
import {Tag} from "bloomer"; // Import css modules stylesheet as styles



class SelectHighlighted extends React.Component {
    state = {
        option: "3"
    }

    handleOptionsChange = (event) => {
        const value=event.target.value;
        this.setState({
            option: value
        });
        this.props.updateParent(this.props.title,value);
    }
    handleTagChange = (value) => {
        this.setState({
            value
        });
        this.props.updateParent(this.props.title,value);
    }
    render () {
        const {options_array,color,title,selected}=this.props?this.props:{};
        // const option_className='opt '+'opt_'+color;
        // const select_className='select '+'select_'+color;
        // debugger;
        return (
            <div style={{width:'100%',height:'100%','marginBottom':'3%',  'textAlign': 'center'}}>
                <h1>{title}</h1>
                {
                    selected===undefined
                     && <div style={{color:'red'}}>

                    None Selected!
                </div>}
                {options_array?options_array.map(option=>
                    <div key={option}>
                        {/*<h1>{option}</h1>*/}
                        <Tag className={selected===option?'is-large':Math.floor(Math.random()*100)%2===0?'is-normal':'is-medium'} onClick={()=>this.handleTagChange(option)} isColor={color}>{option}</Tag>
                    </div>
                ):<div></div>}

            </div>
        );
    }
}
export default SelectHighlighted;
