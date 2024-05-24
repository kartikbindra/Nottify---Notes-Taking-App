
import React from "react";
import ReactDom from "react-dom" ;

function landing(){
    return (<div>
        <h2>This is a notes-taking app!</h2>
        <form action="/signup" method="get">
            <button type="submit">Signup</button>
        </form>
        <form action="/login" method="get">
            <button type="submit">Login</button>
        </form>
    </div>  );


    }


export default landing ;