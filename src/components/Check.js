import React from 'react';
import axios from 'axios';
import Book from './Book';
import './style/Check.css';
import { destination, check_in, check_out, guest_count, loggedIn, loggedOut } from '../actions';
import { connect } from 'react-redux';


// this component is responsible for fetching and displaying the availability details and providing the booking modal.
class Check extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            destinations: [],
            destination: this.props.avail.destination,
            destination_code: '',

            // Initializing the states from redux store.
            check_in: this.props.avail.check_in,
            check_out: this.props.avail.check_out,
            count: (this.props.avail.guest_count),
            availability: [],
            label_value: '',
            amount: 10,
            check_render: "",
            checks: '',
            autoLoad: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

        // fetching all the destinations for displaying in the list.
        axios.get('/destination')
            .then(res => {
                const destinations = res.data;
                this.setState({ destinations }, () => {
                    this.setState({
                        destination: this.props.avail.destination,
                        check_in: this.props.avail.check_in,
                        check_out: this.props.avail.check_out,
                        count: (this.props.avail.guest_count),
                    }, () => {

                        // if the values are already filled through redux states we fetch the availability details.
                        if (this.state.destination !== '' && this.state.check_in !== '' && this.state.check_out !== '' && this.state.count !== '') {
                            let destCode = "";
                            for (let i = 0; i < this.state.destinations.length; i++) {
                                if (this.state.destinations[i].name === this.state.destination) {
                                    destCode = this.state.destinations[i].code;
                                    this.setState({ destination_code: destCode });
                                    this.setState({ amount: this.state.destinations[i].price });
                                    break;
                                }
                            }
                            // checks for destination correctness.
                            if (destCode === "") {
                                this.setState({ checks: "Please select destination from list" });
                            }
                            else {
                                let ci = new Date(this.state.check_in);
                                let co = new Date(this.state.check_out);
                                let today = new Date();
                                today.setDate(today.getDate() - 1);
                                if (ci < today) {
                                    this.setState({ checks: "Can't check in on previous dates." });
                                }
                                else if (ci > co) {
                                    this.setState({ checks: "Check In date can't be greater than check out date" });
                                }
                                else if (parseInt(this.state.count) < 1) {
                                    this.setState({ checks: "The number of guests must be atleast 1" });
                                }
                                else {
                                    let arr = [];

                                    // getting the availability details the format is same as explained in the back end.
                                    axios.get('/availability/' + destCode + this.state.check_in + this.state.check_out + this.state.count)
                                        .then(res => {
                                            let check = true;
                                            for (const [key, value] of Object.entries(res.data)) {
                                                let m = key.slice(5, 7);
                                                let send = "";

                                                // mapping month numbers to names.
                                                if (m === "01") send = "Jan";
                                                else if (m === "02") send = "Feb";
                                                else if (m === "03") send = "Mar";
                                                else if (m === "04") send = "Apr";
                                                else if (m === "05") send = "May";
                                                else if (m === "06") send = "Jun";
                                                else if (m === "07") send = "Jul";
                                                else if (m === "08") send = "Aug";
                                                else if (m === "09") send = "Sep";
                                                else if (m === "10") send = "Oct";
                                                else if (m === "11") send = "Mov";
                                                else if (m === "12") send = "Dec";
                                                arr.push({ "month": send, "day": key.slice(8), "avail": value });
                                                // if availability is less than guests we don't render the cards and displays the not available message.
                                                if (value < parseInt(this.state.count)) {
                                                    check = false;
                                                }
                                            }
                                            if (check) {
                                                this.setState({ label_value: "Hurray!, we are available" });
                                                this.setState({ check_render: "true" });;
                                            }
                                            else {
                                                this.setState({ label_value: "Sorry, We are not available" });
                                                this.setState({ check_render: "false" });
                                            }
                                            this.setState({ availability: arr });
                                        })
                                }
                            }
                        }
                    });
                });
            })

            
    }

    handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            check_render: "",
            label_value: '',
            availability: [],
            checks: "",
        }, () => {

            // Fetching the availability details on every change so that user does not have click check availability again and again.
            // almost same code as in componentDidMount method
            if (this.state.destination !== '' && this.state.check_in !== '' && this.state.check_out !== '' && this.state.count !== '') {
                let destCode = "";
                for (let i = 0; i < this.state.destinations.length; i++) {
                    if (this.state.destinations[i].name === this.state.destination) {
                        destCode = this.state.destinations[i].code;
                        this.setState({ destination_code: destCode });
                        this.setState({ amount: this.state.destinations[i].price });
                        break;
                    }
                }
                if (destCode === "") {
                    this.setState({ checks: "Please select destination from list" });
                }
                else {
                    let ci = new Date(this.state.check_in);
                    let co = new Date(this.state.check_out);
                    let today = new Date();
                    today.setDate(today.getDate() - 1);
                    if (ci < today) {
                        this.setState({ checks: "Can't check in on previous dates." });
                    }
                    else if (ci > co) {
                        this.setState({ checks: "Check In date can't be greater than check out date" });
                    }
                    else if (parseInt(this.state.count) < 1) {
                        this.setState({ checks: "The number of guests must be atleast 1" });
                    }
                    else {
                        let arr = [];
                        axios.get('/availability/' + destCode + this.state.check_in + this.state.check_out + this.state.count)
                            .then(res => {
                                let check = true;
                                for (const [key, value] of Object.entries(res.data)) {
                                    let m = key.slice(5, 7);
                                    let send = "";
                                    if (m === "01") send = "Jan";
                                    else if (m === "02") send = "Feb";
                                    else if (m === "03") send = "Mar";
                                    else if (m === "04") send = "Apr";
                                    else if (m === "05") send = "May";
                                    else if (m === "06") send = "Jun";
                                    else if (m === "07") send = "Jul";
                                    else if (m === "08") send = "Aug";
                                    else if (m === "09") send = "Sep";
                                    else if (m === "10") send = "Oct";
                                    else if (m === "11") send = "Mov";
                                    else if (m === "12") send = "Dec";
                                    arr.push({ "month": send, "day": key.slice(8), "avail": value });
                                    if (value < parseInt(this.state.count)) {
                                        check = false;
                                    }
                                }
                                if (check) {
                                    this.setState({ label_value: "Hurray!, we are available" });
                                    this.setState({ check_render: "true" });;
                                }
                                else {
                                    this.setState({ label_value: "Sorry, We are not available" });
                                    this.setState({ check_render: "false" });
                                }
                                this.setState({ availability: arr });
                            })
                    }
                }
            }
        });

        // setting the redux stores variables to new value.
        if (name === 'destination') {
            this.props.destination(value);
            // console.log(this.props.avail.destination);
        }
        else if (name === 'check_in') {
            this.props.check_in(value);

            // console.log(this.props.avail.check_in);
        }
        else if (name === 'check_out') {
            this.props.check_out(value);

            // console.log(this.props.avail.check_out);
        }
        else if (name === 'count') {
            this.props.guest_count(value);

            // console.log(this.props.avail.guest_count);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        // for handling the submissions same as componentDidMount method
        let destCode = "";
        for (let i = 0; i < this.state.destinations.length; i++) {
            if (this.state.destinations[i].name === this.state.destination) {
                destCode = this.state.destinations[i].code;
                this.setState({ destination_code: destCode });
                this.setState({ amount: this.state.destinations[i].price });
                break;
            }
        }
        // Destination not found in the list.
        if (destCode === "") {
            this.setState({ checks: "Please select destination from list" });
        }
        else {
            // converting 
            let ci = new Date(this.state.check_in);
            let co = new Date(this.state.check_out);
            let today = new Date();
            today.setDate(today.getDate() - 1);
            if (ci < today) {
                this.setState({ checks: "Can't check in on previous dates." });
            }
            else if (ci > co) {
                this.setState({ checks: "Check In date can't be greater than check out date" });
            }
            else if (parseInt(this.state.count) < 1) {
                this.setState({ checks: "The number of guests must be atleast 1" });
            }
            else {
                let arr = [];
                axios.get('/availability/' + destCode + this.state.check_in + this.state.check_out + this.state.count)
                    .then(res => {
                        let check = true;
                        for (const [key, value] of Object.entries(res.data)) {
                            let m = key.slice(5, 7);
                            let send = "";
                            if (m === "01") send = "Jan";
                            else if (m === "02") send = "Feb";
                            else if (m === "03") send = "Mar";
                            else if (m === "04") send = "Apr";
                            else if (m === "05") send = "May";
                            else if (m === "06") send = "Jun";
                            else if (m === "07") send = "Jul";
                            else if (m === "08") send = "Aug";
                            else if (m === "09") send = "Sep";
                            else if (m === "10") send = "Oct";
                            else if (m === "11") send = "Mov";
                            else if (m === "12") send = "Dec";
                            arr.push({ "month": send, "day": key.slice(8), "avail": value });
                            if (parseInt(value) < parseInt(this.state.count)) {
                                check = false;
                            }
                        }
                        if (check) {
                            this.setState({ label_value: "Hurray!, we are available" });
                            this.setState({ check_render: "true" });;
                        }
                        else {
                            this.setState({ label_value: "Sorry, We are not available" });
                            this.setState({ check_render: "false" });
                        }
                        this.setState({ availability: arr });
                    })
            }
        }
    }


    render() {
        return (
            <React.Fragment>
                <div className="check_center">
                    <div className="check_main">
                        <h1>Booking Section</h1>
                        <span>Fill in below details to check availability.</span>

                        {/* form for availability checking */}
                        <form autoComplete="off" className="form" onSubmit={this.handleSubmit}>
                            <div className="form_contents">
                                <label>
                                    Destination : <br />
                                    {/* Getting all the destination through api and making a list */}
                                    <input value={this.state.destination} name="destination" onChange={this.handleChange} list="destinations" required={true} />
                                    <datalist id="destinations">
                                        {this.state.destinations.map((destination, key) => <option key={key} value={destination.name}></option>)}
                                    </datalist>
                                </label>
                                <label>
                                    Check In :<br />
                                    <input value={this.state.check_in} name="check_in" type="date" onChange={this.handleChange} required={true} />
                                </label>
                                <label>
                                    Check Out :<br />
                                    <input value={this.state.check_out} name="check_out" type="date" onChange={this.handleChange} required={true} />
                                </label>
                                <label>
                                    No. of guests :<br />
                                    <input value={this.state.count} name="count" type="text" onChange={this.handleChange} required={true} />
                                </label>
                            </div>
                            <div className="form_buttons">
                                <label id="checks_label">{this.state.checks}</label>
                                <input type="submit" value="CHECK AVAILABILITY" />
                            </div>
                        </form>

                        {/* Book component displays the modal for booking . */}
                        <Book label_value={this.state.label_value} availability={this.state.availability} check={this.state.check_render} destination_code={this.state.destination_code} destination={this.state.destination} check_in={this.state.check_in} check_out={this.state.check_out} count={parseInt(this.state.count)} amount={this.state.amount} />
                    </div>
                </div>

            </React.Fragment>
        );
    }
}


// connecting the redux store to react.
const mapStateToProps = (state) => {
    return {
        avail: state.availReducer,
    }
}

const mapDispatchToProps = () => {
    return {
        destination, check_in, check_out, guest_count, loggedIn, loggedOut
    }
}
export default connect(mapStateToProps, mapDispatchToProps())(Check);