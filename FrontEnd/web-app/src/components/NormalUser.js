import React from "react";
import image from "../images/frajer.png";

export default function NormalUser() {
    return (
        <div>
            <h1>Normal User</h1>
            <img src={image} alt="zalogowany"/>
        </div>
    );
}