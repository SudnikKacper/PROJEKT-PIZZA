import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/API";

function AllZamowienia() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderData = await getAllOrders();

                setOrders(orderData);

            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (orderId) => {
        try {

            await updateOrderStatus(orderId, 0);


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

            const orderData = await getAllOrders();
            setOrders(orderData);
        } catch (error) {
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