import axios from 'axios';
import React from 'react';
import './style/Modal.css';
import { loggedIn, loggedOut} from '../actions';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';


// component for handling partial cancellation
class PartialCancel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            checks : '',
            details : '',
            amount : '',
            new_guest_count : '',
            redirect : false,
        }
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.new_guest_count < this.props.guest_count && this.state.new_guest_count > 0){
            axios.put('/bookings/' + this.props.booking_id, {destination : this.props.destination, name: this.props.name, email : this.props.email , phone : this.props.phone, guest_count : this.props.guest_count - this.state.new_guest_count, check_in : this.props.check_in, check_out : this.props.check_out}, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                .then(res => {
                    alert("Your booking has been updated");
                    this.setState({redirect : true});
                });
        }
    }

    handleChange(event){
        this.setState({new_guest_count : event.target.value})
        if(event.target.value >= this.props.guest_count){
            this.setState({
                checks : 'Please enter number less than number of guest',
                details : '',
                amount : '',
            })
        }
        else if(event.target.value <= 0){
            this.setState({checks : 'Please enter number greater than 0', details : '', amount : ''});
        }
        else {
            // functions for getting the number of days between two dates.
            function treatAsUTC(date) {
                var result = new Date(date);
                result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
                return result;
            }
            
            function daysBetween(startDate, endDate) {
                var millisecondsPerDay = 24 * 60 * 60 * 1000;
                return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
            }
            //getting today's date.
            let today = new Date();
            today.setDate(today.getDate());

            // algorithm for deduction according to the policy provided
            if(this.props.percentPaid === 30){
                if(parseInt(daysBetween(today, this.props.check_in)) > 7){
                    this.setState({checks : '',details : 'You will get full refund for each guest.',amount : ((this.props.amount * 0.3) / this.props.guest_count) * (event.target.value)});
                }
                else {
                    this.setState({checks : '',details : 'You will not get any refund.', amount : 0});
                }
            }
            else {
                if(parseInt(daysBetween(today, this.props.check_in)) > 7){
                    this.setState({checks : '',details : 'You will get full refund for each guest.',amount : (this.props.amount / this.props.guest_count) * event.target.value});
                }
                else {
                    this.setState({checks : '',details : '30% will be deducted for each guest.',amount : event.target.value * (0.7 * (this.props.amount / this.props.guest_count))});
                }
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <a onClick={this.handleClick} id="open" href={"#openModal" + this.props.id + "par"}>Partial Cancel</a>

                    <div id={"openModal" + this.props.id + "par"} className="modalDialog">
                        <div>
                            <a href="#close" title="Close" className="close">X</a>
                            Please input the number of guest you want to cancel. This should be less than {this.props.guest_count}.
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <input onChange={this.handleChange.bind(this)} required={true}/>
                                <div>{this.state.details}</div>
                                You will be refunded : <div>{this.state.amount}</div>
                                <label>{this.state.checks}</label>
                                <input type="submit" value="Cancel" />
                            </form>
                        </div>
                    </div>
                </div>
                {(this.state.redirect === true) ? <Redirect to="/view" /> : ''}
            </React.Fragment>
        );
    }
}


// connecting the react 
const mapStateToProps = (state) => {
    return{
        user : state.userReducer,
    }
}

const mapDispatchToProps = () => {
    return {
        loggedIn, loggedOut
    }
}
export default connect(mapStateToProps, mapDispatchToProps())(PartialCancel);