
import React from 'react'
import styles from './tagging_colors.css'; // Import css modules stylesheet as styles



class SelectHighlighted extends React.Component {
    state = {
        option: "3"
    }

    handleOptionsChange = (event) => {
        this.setState({
            option: event.target.value
        });
    }

    render () {
        const {options_array,color}=this.props?this.props:{};
        const option_className='opt '+'opt_'+color;
        const select_className='select '+'select_'+color;
        return (
            <div style={{width:'100%',height:'100%','margin-bottom':'10%',  'text-align': 'center'}}>
            <select  className={select_className} size={5} value={this.state.option} onChange={this.handleOptionsChange}>
                <option className={option_className} value='1'>Option 1</option>
                <option className={option_className} value='2'>Option 2</option>
                <option className={option_className}value='3'>Option 3</option>
                <option className={option_className} value='4'>Option 4</option>
                <option className={option_className} value='5'>Option 5</option>
            </select>
            </div>
        );
    }
}
export default SelectHighlighted;
