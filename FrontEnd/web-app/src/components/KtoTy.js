import React from "react";
import NormalUser from "../components/NormalUser";
import Admin from "../components/Admin";
import User from "./User";
import useCookies from "./useCookies";

export default function KtoTy() {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }

    console.log(userRole);


    return (
        <div>
            {role[0] === "" && <NormalUser />}
            {role[0] === "User" && <User />}
            {role[0] === "Admin" && <Admin />}
        </div>
    );
}
