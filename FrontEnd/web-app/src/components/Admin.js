import React from "react";
import image from "../images/sigma.jpg";

export default function Admin() {
    console.log("Rendering ADMIN component");
    return (
        <div>
            <h1>Admin</h1>
            <img src={image} alt="zalogowany"/>
        </div>
    );
}