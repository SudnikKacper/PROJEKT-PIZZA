// components/Order.js
import React from "react";

function Order({ cart, onRemoveFromCart }) {

        // TODO dodać formularz by wjebać do bazy danych to co trzeba

    return (
        <div className="Order">
            <h2>Twoje zamówienie:</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        {item.name} - Quantity: {item.quantity} - Total: {item.total} PLN
                        <button onClick={() => onRemoveFromCart(item.pizzaId)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Order;
