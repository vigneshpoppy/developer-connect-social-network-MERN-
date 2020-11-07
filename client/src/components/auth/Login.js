import React ,{Fragment,useState}from 'react'
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login } from "../../action/auth"
import {BrowserRouter as Router,Route,} from 'react-router-dom'
 const Login = ({login,isAuthenticated}) => {
    const [formdata,setFormdata]=useState({
        email:'',
        password:'',
    
    });
    const{ email,password}=formdata;
    const onChange =e=>setFormdata({...formdata,[e.target.name]:e.target.value});
    const onSubmit=e=>{
        e.preventDefault();
        login({email,password});

        //redirect to dashboad after login sucess
        if(isAuthenticated)
        {
            console.log(isAuthenticated)
            console.log("done");
           // return   <Redirect to='/dashboard' />
           <Router>
                 <Redirect to='/dashboard'/>
           
            
           </Router>
                   
            }

       

    }
    return (
        <Fragment>
             <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign In Your Account</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
               
                
                    <div className="form-group">
                    <input type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={e=>onChange(e)} />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>


                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password}
                    onChange={e=>onChange(e)}
                    required
                />
               </div>

                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                 Create an account? <Link to="/Register">Sign Up</Link>
            </p>
            
        </Fragment>
    )
};
Login.propTypes={
    login:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
    
}
const mapStateToProp=state=>({
    isAuthenticated:state.auth.isAuthenticated
})


export default connect(mapStateToProp,{login}) (Login);