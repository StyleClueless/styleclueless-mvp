
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
        const option_className='opt '+'opt_'+color;
        const select_className='select '+'select_'+color;
        return (
            <div style={{width:'100%',height:'100%','marginBottom':'10%',  'textAlign': 'center'}}>
                <h1>{title}</h1>
                {/*<select  className={select_className} size={5} value={this.state.option} onChange={this.handleOptionsChange}>*/}
                {/*<option className={option_className} value='1'>Option 1</option>*/}
                {/*<option className={option_className} value='2'>Option 2</option>*/}
                {/*<option className={option_className}value='3'>Option 3</option>*/}
                {/*<option className={option_className} value='4'>Option 4</option>*/}
                {/*<option className={option_className} value='5'>Option 5</option>*/}
            {/*</select>*/}
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
