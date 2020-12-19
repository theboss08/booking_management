import './style/Home.css';
import newcard from './style/new.png';
import oldcard from './style/old.png';
import { loggedIn, loggedOut} from '../actions';
import {connect} from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';

// the home page contains link for new booking and for checking or updating old ones.
class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <div className="brand_name">
                    WELCOME
                </div>
                <div className="home_body">
                    <div className="home_card">
                        {/* <Link to="/register">Register</Link> */}
                        
                        <img src={newcard} alt="new card" />
                        <div className="card_header">New Here ?</div>
                        <div>Click below to make a new booking right<br />now</div>
                        <Link to="/check">CHECK AND BOOK</Link>
                    </div>
                    <div id="card2" className="home_card">
                        
                        
                        <img src={oldcard} alt="Old Card" />
                        <div className="card_header">Already Booked ?</div>
                        <div>Click below to update or cancel  your <br /> booking.</div>
                        <Link to="/view">UPDATE OR DELETE</Link>
                    </div>
                </div>
            </div>
        );
    }
}

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
export default connect(mapStateToProps, mapDispatchToProps())(Home);
