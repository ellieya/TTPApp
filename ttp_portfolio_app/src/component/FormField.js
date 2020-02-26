import React from 'react';
import sha from 'sha.js';

/**
 * Expected props:
 * 
 * desc (mandatory) - Text that displays to the left of the input.
 * type (optional) - Changes input type. If type is not provided, defaults to text.
 * update (mandatory) - Callback function called whenever input value changes. Function expected to take 2 arguments: input desc and input value
 */

class FormField extends React.Component {
    render() {
        return (
            <div className="field">
                <span>{this.props.desc}: </span>
                <input type={this.props.type ? this.props.type : "text"} onChange={
                    (e) => {
                        this.props.update(this.props.desc, this.props.type === "password" ? sha('sha256').update(e.target.value).digest('hex') : e.target.value)
                    }
                } />
            </div>
        )
    }
}

export default FormField;