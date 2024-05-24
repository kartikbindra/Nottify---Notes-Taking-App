
import React from "react";
import ReactDom from "react-dom" ;

function Login() {
    return (
        <div>
            <h1>Login</h1>
            <form action="/login" method="post">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required /><br /><br />
                
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required /><br /><br />
                
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}


export default Login ;
