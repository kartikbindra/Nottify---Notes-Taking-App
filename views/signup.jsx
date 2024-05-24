
import React from "react";
import ReactDOM from "react-dom";

function Signup() {
  return (
    <div>
      <h1>Signup</h1>
      <form action="/signup" method="post">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required /><br /><br />
        
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required /><br /><br />
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required /><br /><br />
        
        <input type="submit" value="Signup" />
      </form>
    </div>
  );
}
export default Signup;
