import React from 'react';
import axios from 'axios';
import { loggedIn, loggedOut } from '../actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';


// Component for implementing login
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            check_login: '',
            redirect: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // handling input changes
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }


    // handling form submit
    handleSubmit(event) {
        event.preventDefault();

        // setting axios to request with credentials.
        axios.defaults.withCredentials = true;

        // Getting the csrf token for preventing csrf
        axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
            axios.post('/login/', { email: this.state.email, password: this.state.password })
                .then(res => {
                    if (res.data.message === 'false') {
                        this.setState({ check_login: "Please check your email id and password" });
                    }
                    else {

                        // storing user details in redux store.
                        this.props.loggedIn({ name: res.data.user.name, email: this.state.email, phone: res.data.user.phone, token: res.data.token });

                        // redirecting to home
                        this.setState({ redirect: true });
                    }
                });
        });
    }

    render() {
        return (
            // simple form validation
            <div className="login_container">
                <div className="login_form">
                <div>Enter your login details.</div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Email :
                        <input value={this.state.email} name="email" onChange={this.handleChange} />
                    </label>
                    <label>
                        Password :
                        <input value={this.state.password} name="password" onChange={this.handleChange} />
                    </label>
                    <label value={this.state.check_login} />
                    <input type="submit" value="Login" />
                </form>
                <Link to="/register">Register Here</Link>
                {(this.state.redirect === true) ? <Redirect to="/" /> : ''}
                </div>
            </div>
        );
    }
}


// connecting react with redux store
const mapStateToProps = (state) => {
    return {
        user: state.userReducer,
    }
}

const mapDispatchToProps = () => {
    return {
        loggedIn, loggedOut
    }
}
export default connect(mapStateToProps, mapDispatchToProps())(Login);