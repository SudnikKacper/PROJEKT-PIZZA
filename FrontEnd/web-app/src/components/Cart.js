import React from "react";
import {Link} from "react-router-dom";

function Cart({ cart, onRemoveFromCart, onPlaceOrder}) {


    return (
        <div className={"Cart"}>

            <h2>Twój koszyk:</h2>

            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        {item.name} - Quantity: {item.quantity} - Total: {parseFloat(item.total).toFixed(2)} PLN
                        <button onClick={() => onRemoveFromCart(item.pizzaId)}>❌</button>
                    </li>
                ))}
            </ul>
            <Link to={{ pathname: "/order" }}>
                <button onClick={onPlaceOrder}>Przejdź do zamówienia</button>
            </Link>
        </div>
    );
}

export default Cart;
