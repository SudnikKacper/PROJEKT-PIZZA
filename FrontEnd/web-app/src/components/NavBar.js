import React from "react";
import {Link} from "react-router-dom";

function NavBarButton({ to, label }) {
    return (
        <Link to={{ pathname: to }}>
            <button>
                {label}
            </button>
        </Link>
    );
}
function NavBar() {

    /*PAMIĘTAĆ JAK DODA SIĘ LINK KOLEJNY TO WYPIERDOLI POZA OBRAMÓWKĘ, ZWIĘKSZYĆ MAX HEIGHT W STYLES.CSS*/
    return (
        <div className={'navbar'}>
            <ul>
                <li>
                    <NavBarButton to="/" label="STRONA GŁÓWNA"/>
                </li>
                <li>
                    <NavBarButton to="/login" label="LogIn"/>
                </li>
                <li>
                    <NavBarButton to="/na20" label="WYŚWIETLANIE"/>
                </li>
                <li>
                    <NavBarButton to="/pizza/1" label="EDYCJA 1"/>
                </li>
                <li>
                    <NavBarButton to="/pizza/1/s" label="EDYCJA 2"/>
                </li>
                <li>
                    <NavBarButton to="/pizza/add" label="DODAWANIE"/>
                </li>
                <li>
                    <NavBarButton to="/order" label="ZAMÓW"/>
                </li>
                <li>
                    <NavBarButton to="/myorder" label="MOJEZAMOWIENIE"/>
                </li>
                <li>
                    <NavBarButton to="/KtoTy" label="SPRAWDŹ KTO TY"/>
                </li>
                <li>
                    <NavBarButton to="/TEST3" label="TEST"/>
                </li>
            </ul>
        </div>
    );
}


export default NavBar;