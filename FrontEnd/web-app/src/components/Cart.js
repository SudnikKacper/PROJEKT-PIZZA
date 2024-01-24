import React from "react";
import {Link} from "react-router-dom";

function Cart({ cart, onRemoveFromCart, onPlaceOrder}) {


    return (
        <div className={"Cart"}>

            <h2>Twój koszyk:</h2>

            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        <div>
                            {item.name} - Quantity: {item.quantity}
                        </div>
                        <div>
                            Total: {parseFloat(item.total).toFixed(2)} PLN
                        </div>
                        <button onClick={() => onRemoveFromCart(item.pizzaId)}>❌</button>
                    </li>
                ))}
            </ul>
            <Link to={{ pathname: "/order" }}>
                <button onClick={onPlaceOrder} disabled={!cart.length}>
                    Przejdź do zamówienia
                </button>
            </Link>
        </div>
    );
}

export default Cart;
