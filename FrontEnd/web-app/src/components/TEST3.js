import React from "react";
import useCookies from './useCookies';
import image from "../images/gandalf.png";
import image2 from "../images/sigma.jpg";
export default function TEST3() {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }

    // console.log(userRole);
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>

            {role[0] === 'Admin' && (
                <div>
                    <img src={image2} alt="SIGMA"/>
                    <h2>Admin Section</h2>

                    <img src={image} alt="hoho"/>
                </div>
            )}

            {
                role[0] !== 'Admin' && (

                    <div>
                        <h2>No kurka wodna powiem ci nie masz admina XD </h2>
                    </div>
                )
            }
            <p>A to jest coś co widzi każdy.</p>
        </div>
    );
}