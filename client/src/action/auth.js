import axios from 'axios';
import{REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL} from "./types";
import{setAlert} from '../action/alert'
import setAuthToken from '../utils/setauthtoken';



//load user
export const loadUser=()=>async dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }
    try{
        const res =await axios.get('/api/auth');
        dispatch({
            type:USER_LOADED,
            payload:res.data
        });

    }catch(err){
        dispatch({
            type:AUTH_ERROR,
        })

    }

}




//register user
export const register=({name,email,password})=>async dispatch=>{
    const config={
        Header:{
            'Content-Type':'application/json'
        }
    }
    // console.log(email);
    const body= JSON.parse(JSON.stringify({name,email,password}));
    // console.log(typeof(body));
    // console.log(body.name);
    // console.log("34");
    try{
        
        const res = await axios.post('api/user',body,config);
    
       await dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
           
        });
        dispatch(loadUser())
    }catch(err){
        const errors=err.response.data.errors;
        if(errors){
          
          
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }

        dispatch({
            type:REGISTER_FAIL,
          
        });
    }
};





//Login user
export const login=({email,password})=>async dispatch=>{
    const config={
        Header:{
            'Content-Type':'application/json'
        }
    }
    // console.log(email);
    const body= JSON.parse(JSON.stringify({email,password}));
    // console.log(typeof(body));
    // console.log(body.name);
    // console.log("34");
    try{
        
        const res = await axios.post('api/auth',body,config);
    
       await dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
           
        });
        dispatch(loadUser());
    }catch(err){
        const errors=err.response.data.errors;
        if(errors){
          
          
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }

        dispatch({
            type:LOGIN_FAIL,
          
        });
    }
};