import React from "react";
import useCookies from "./useCookies";
import NormalZamowienia from "./NormalZamowienia";
import AllZamowienia from "./AllZamowienia";

function MojeZamowienie() {
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
            {role[0] === "" && <div>
                <p> By wyświetlić zamówienie musisz być zalogowanym</p>
            </div>}
            {role[0] === "Admin" && <AllZamowienia />}
            {role[0] === "User" && <NormalZamowienia />}


        </div>
    )

}



export default MojeZamowienie;