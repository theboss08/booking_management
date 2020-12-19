import axios from 'axios';
import React from 'react';
import './style/Modal.css';
import { loggedIn, loggedOut} from '../actions';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';


// this component is responsible for providing booking form and doing request to the back end.
class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            amount: this.props.amount,
            redirect : false,
            redirectBooked : false,
            dateDiff : '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        this.setState({
            name : this.props.user.name, 
            email : this.props.user.email, 
            phone : this.props.user.phone,
        })
        function treatAsUTC(date) {
            var result = new Date(date);
            result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
            return result;
        }
        
        function daysBetween(startDate, endDate) {
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
        }
        let today = new Date();
        today.setDate(today.getDate() - 1);
        this.setState({dateDiff : parseInt(daysBetween(today, this.props.check_in))}, () => {
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleClick(){
        if(this.props.user.token === ''){
            this.setState({redirect : true});
        }
    }

    // function for doing 30% booking
    handleAlternate(event){
        event.preventDefault();
        axios.defaults.withCredentials = true;
        // doing post request to the back end.
            axios.post('/bookings/', { name: this.state.name, email: this.state.email, phone: this.state.phone, destination: this.props.destination_code, guest_count: this.props.count, check_in: this.props.check_in, check_out: this.props.check_out, percentPaid : 30}, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
            .then(res => {
                this.setState({redirectBooked : true});
            });
    }

    // function for doing 100% booking
    handleSubmit(event) {
        event.preventDefault();
        axios.defaults.withCredentials = true;
            axios.post('/bookings/', { name: this.state.name, email: this.state.email, phone: this.state.phone, destination: this.props.destination_code, guest_count: this.props.count, check_in: this.props.check_in, check_out: this.props.check_out, percentPaid : 100}, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
            .then(res => {
                this.setState({redirectBooked : true});
            });
    }
    render() {
        return (
            <React.Fragment>
                <div>
                    <a onClick={this.handleClick} id="open" href="#openModal">BOOK NOW</a>

                    <div id="openModal" className="modalDialog">
                        <div>
                            <a href="#close" title="Close" className="close">X</a>
                            <div> Destination : {this.props.destination} </div>
                            <div> Check In Date : {this.props.check_in} </div>
                            <div> Check Out Date : {this.props.check_out} </div>
                            <div> Amount : {this.state.amount} </div>

                            {/* Booking form */}
                            <form className="modal_form" onSubmit={this.handleSubmit}>
                                <label>
                                    Name :
                                    <input value={this.state.name} onChange={this.handleChange} name="name" required={true} />
                                </label>
                                <label>
                                    Email :
                                    <input value={this.state.email} onChange={this.handleChange} name="email" required={true} />
                                </label>
                                <label>
                                    Phone :
                                    <input value={this.state.phone} onChange={this.handleChange} name="phone" required={true} />
                                </label>
                                <div>
                                    
                                    {/* checking if the check in date is atleast 7 days more than today's date for enabling users for paying 30% */}
                                    {(this.state.dateDiff > 7) ? 
                                    <div>

                                     <button onClick={this.handleAlternate.bind(this)}>PAY 30%</button>
                                     <input type="submit" value="PAY 100%" />
                                    </div> : 
                                    <div>
                                        <input id="hund" name="100" type="submit" value="PAY" />
                                    </div>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* if user is not authenticated redirect to login page */}
                {(this.state.redirect === true) ? <Redirect to="/login" /> : ''}

                {/* if booked redirect to home page. */}
                {(this.state.redirectBooked === true) ? <Redirect to="/" /> : ''}
            </React.Fragment>
        );
    }
}


// connecting redux store to react.
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
export default connect(mapStateToProps, mapDispatchToProps())(Modal);