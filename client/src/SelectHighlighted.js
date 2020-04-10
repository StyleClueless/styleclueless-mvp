
import React from 'react'
import styles from './red.css'; // Import css modules stylesheet as styles

const css=


    {"opt":{"background":"#ffffff","color":"#ff0000"},"select__opt_checked":{"background":"linear-gradient(#ff0000, #ff0000)","WebkitTextFillColor":"#ffffff","color":"#ffffff"},"select__opt_focus":{"background":"linear-gradient(#ff0000, #ff0000)","WebkitTextFillColor":"#ffffff","color":"#ffffff"}};

/*
.opt {
  background: #ffffff;
  color: #ff0000;
}

.select .opt:checked,
.select .opt:focus {
  background: linear-gradient(#ff0000, #ff0000);
  -webkit-text-fill-color: #ffffff;
  color: #ffffff;
}



 */

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
        // let {options_array,color}=this.props?this.props:{};
        // color='red';
        return (
            <select className={styles.select} size={5} value={this.state.option} onChange={this.handleOptionsChange}>
                <option className={styles.opt} value='1'>Option 1</option>
                <option className={styles.opt} value='2'>Option 2</option>
                <option className={styles.opt} value='3'>Option 3</option>
                <option className={styles.opt} value='4'>Option 4</option>
                <option className={styles.opt} value='5'>Option 5</option>
            </select>
        );
    }
}
export default SelectHighlighted;
