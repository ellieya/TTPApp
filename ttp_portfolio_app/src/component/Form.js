import React from 'react';
import FormField from './FormField';

/**
 * Expected props:
 * 
 * title (mandatory) - Title of the form
 * fields (mandatory) - Must be an array of objects with at least 'desc' attribute. Field(s) to display.
 * submitAction (mandatory) - Callback function to execute on submit button press OR input change. Expect the state of the form to be returned.
 * submitText (optional) - Provide alternative text for submit button
 * changeType (optional) - Switches form responsiveness based onChange (every state change) rather than onClick
 * class (optional) - any extra classes to assign the form
 */

class Form extends React.Component {

    constructor(props) {
        super(props);

        //Boolean to guarantee render call due to onChange in order to circumvent infinite calls of render amongst 3 different components
        this.valueReceived = false;
    }

    componentDidMount() {
        this.fields = this.buildFields();
    }

    /**
     * buildFields
     * Builds and returns a list of FormField objects from an expected prop containing array of objects with at least 'desc' attribute in them.
     * Throws error if there is unexpected input.
     */
    buildFields = () => {
        let fields = [];

        try {
            this.props.fields.forEach((element) => {
                fields.push(<FormField desc={element.desc} type={element.type ? element.type : "text"} update={this.receiveValue} key={element.desc + element.type} />);
                this.setState({
                    [element.desc]: ""
                })
            })
        } catch (err) {
            console.log(err);
            console.log("Did you check that you are sending Form an array of objects with a 'desc' attribute?")
        }

        return fields;
    }

    /**
     * receiveValue
     * Callback function sent over to FormField to collect information.
    */
    receiveValue = (desc, newValue) => {
        this.setState({
            [desc]: newValue
        })

        this.valueReceived = true;

        //Value checker
        console.log(this.state);
    }

    render() {
        if (this.props.changeType) {
            try {
                if (this.valueReceived) {
                    this.valueReceived = false;
                    this.props.action(this.state);
                }
            } catch (err) {
                console.log(err);
                console.log("Did you check that an action function for Form was specified?")
            }
            return (<div className={"form " + this.props.class}>
                <h1>{this.props.title}</h1>
                {this.fields}
            </div>)
        } else {
            return (
                <div className={"form " + this.props.class}>
                    <h1>{this.props.title}</h1>
                    {this.fields}
                    <button type="submit" onClick={() => {
                        try {
                            console.log("Form is returning state");
                            console.log(this.state);
                            console.log(Object.keys(this.state).length);
                            this.props.action(this.state);
                        } catch (err) {
                            console.log(err);
                            console.log("Did you check that an action function for Form was specified?")
                        }
                    }}>
                        {this.props.submitText ? this.props.submitText : "Submit"}
                    </button>
                </div>
            )
        }
    }
}

export default Form;