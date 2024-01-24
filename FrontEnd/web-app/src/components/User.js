import React from "react";
import image from "../images/loggedin.jpg";

export default function User() {
    console.log("Rendering User component");
    return (
        <div>
            <h1>User</h1>
            <img src={image} alt="zalogowany" />
        </div>
    );
}
