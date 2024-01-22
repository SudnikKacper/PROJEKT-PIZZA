import React, { useState, useEffect } from "react";
import useCookies from "./useCookies";
import { getAllUserOrders } from "../services/API";

function NormalZamowienia() {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    const role = userRole.split('+');
    const userId = role[1];

    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        // Pobierz zamówienia dla danego użytkownika po zamontowaniu komponentu
        getAllUserOrders(userId)
            .then((response) => {
                setUserOrders(response);
            })
            .catch((error) => {
                console.error("Error fetching user orders:", error);
            });
    }, [userId]);

    // Funkcja zamieniająca status zamówienia na odpowiedni tekst
    const getStatusText = (status) => {
        return status === 0 ? "Dostarczone" : "W trakcie realizacji";
    };

    return (
        <div>
            <h2>Zamówienia dla użytkownika o ID: {userId}</h2>
            {userOrders && userOrders.map((order) => (
                <div key={order.orderId}>
                    <p>ID zamówienia: {order.orderId}</p>
                    <p>Status: {getStatusText(order.status)}</p>
                </div>
            ))}
        </div>
    );
}

export default NormalZamowienia;
