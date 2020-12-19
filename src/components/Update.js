import React from 'react';
import axios from 'axios';
import {loggedIn, loggedOut} from '../actions';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';


// component for handling updation
class Update extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            email: '',
            phone: '',
            destinations: [],
            destination: '',
            destination_code: '',
            guest_count: '',
            check_in: '',
            check_out: '',
            booked_amount: '',
            check_render: "",
            label_value: '',
            availability: [],
            check: false,
            checks : '',
            amount: '',
            redirect : false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if(this.props.user.token === ''){
            this.setState({redirect : true});
        }
        else {

            // request for getting all the booking data.
            axios.get('/bookings/' + this.props.location.pathname.slice(8), {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
            .then(res => {
                console.log(res.data);
                this.setState({
                    id: res.data.code,
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    destination_code: res.data.destination_code,
                    destination: res.data.destination_name,
                    guest_count: res.data.guest_count,
                    check_in: res.data.check_in,
                    check_out: res.data.check_out,
                    booked_amount: res.data.amount,
                })
            });
        axios.get('/destination')
            .then(res => {
                const destinations = res.data;
                this.setState({ destinations });
            })
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        // request for updating the values
                axios.put('/bookings/' + this.state.id, { name: this.state.name, phone: this.state.phone, email: this.state.email, check_in: this.state.check_in, check_out: this.state.check_out, destination: this.state.destination_code, guest_count: this.state.guest_count }, {headers : {'Authorization' : 'Bearer ' + this.props.user.token}})
                    .then(res => {
                        alert("Your details has been changed");
                    });
                    event.preventDefault();
            }

        render() {
            return (
                <div className="update_main">
                {(this.state.redirect === true) ? <Redirect to="/login" /> : ''}
                    <div>
                    {/* form for modifying only name email phone can be modified */}
                        <form autoComplete="off" className="update_form" onSubmit={this.handleSubmit}>
                            <label>
                                Name :
                    <input name="name" onChange={this.handleChange} value={this.state.name} />
                            </label>
                            <label>
                                Email :
                    <input name="email" onChange={this.handleChange} value={this.state.email} />
                            </label>
                            <label>
                                Phone :
                    <input name="phone" onChange={this.handleChange} value={this.state.phone} />
                            </label>
                            <input type="submit" value="Update" />
                        </form>
                    </div>
                </div>
            );
        }
    }

    // connecting redux store to react props.
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
    export default connect(mapStateToProps, mapDispatchToProps())(Update);