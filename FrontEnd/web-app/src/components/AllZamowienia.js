import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/API";
import useCookies from "./useCookies";

function AllZamowienia() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders data
                const orderData = await getAllOrders();

                // Set the orders state with the received data
                setOrders(orderData);

            } catch (error) {
                // Handle errors
                setError(error.message);
            }
        };

        // Call the fetchData function
        fetchData();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    const handleStatusChange = async (orderId) => {
        try {

            await updateOrderStatus(orderId, 0);


            // Refetch orders data after the status change
            const orderData = await getAllOrders();
            setOrders(orderData);
        } catch (error) {
            // Handle errors
            setError(error.message);
        }
    };
    const handleDeleteOrder = async (orderId) => {
        try {

            await deleteOrder(orderId);

            // Refetch orders data after the status change
            const orderData = await getAllOrders();
            setOrders(orderData);
        } catch (error) {
            // Handle errors
            setError(error.message);
        }
    };

    return (

        <div>
            {error ? (
                <p>Error loading orders: {error}</p>
            ) : (
                <div>
                    <h2>All Zamowienia</h2>
                    {orders.map((order) => (
                        <div key={order.orderId}>
                            <p>Order ID: {order.orderId}</p>
                            <p>Klient: {order.klient}</p>
                            <p>Status: {order.status}</p>
                            <p>Przewidywana Dostawa: {order.przewidywanaDostawa}</p>
                            <h3>Items:</h3>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.orderedItemId}>
                                        {item.pizzaName} - Quantity: {item.ilosc} - Price per piece: {item.cenaSzt} - Total: {item.razem}
                                    </li>
                                ))}
                            </ul>
                            {order.status === 1 ? (
                                <button onClick={() => handleStatusChange(order.orderId)}>
                                    Zrealizowane ✅
                                </button>
                            ) : (
                                <button onClick={() => handleDeleteOrder(order.orderId)}>
                                    Usuń ❌
                                </button>
                            )}
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllZamowienia;