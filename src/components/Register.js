import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';


// Component for creating new user.
class Register extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            name : '',
            phone : '',
            email : '',
            password : '',
            redirect : false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // handling input change
    handleChange(event){
        const target = event.target;
        const name = target.name;
        let value = target.value;
        this.setState({[name] : value});
    }


    // handling form submit
    handleSubmit(event){
        event.preventDefault();
        axios.defaults.withCredentials = true;
            axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
                axios.post('/register', {name : this.state.name, email : this.state.email, phone : this.state.phone, password : this.state.password})
                .then(res => {
                    alert("Your account has been created");
                    this.setState({redirect : true});
                })
        });
    }

    render(){
        return(
            <div className="register_container">
            {(this.state.redirect === true) ? <Redirect to="/login" /> : ''}
                <div className="register_form">
                <div>Please enter your details : </div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name : 
                        <input name="name" onChange={this.handleChange} required={true} />
                    </label>
                    <label>
                        Email : 
                        <input name="email" onChange={this.handleChange} required={true} />
                    </label>
                    <label>
                        Phone : 
                        <input name="phone" onChange={this.handleChange} required={true} />
                    </label>
                    <label>
                        Password : 
                        <input name="password" type="password" onChange={this.handleChange} required={true} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                </div>
            </div>
        );
    }
}

export default Register;