import React, { useState } from "react";
import useCookies from "./useCookies";
import {addOrder} from "../services/API";
import AllZamowienia from "./AllZamowienia";

function Order({ cart, onRemoveFromCart}) {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }
    const [customerName, setCustomerName] = useState("");
    const [isPriority, setIsPriority] = useState(false);

    const handleInputChange = (e) => {
        if (e.target.name === "customerName") {
            setCustomerName(e.target.value);
        } else if (e.target.name === "isPriority") {
            setIsPriority(e.target.checked);
        }
    };


    const totalAmount = cart.reduce((total, item) => total + parseFloat(item.total), 0).toFixed(2);

    function onCartRefresh() {
        window.location.reload();
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Add expected delivery as time now + 2 minutes
            const deliveryTime = new Date(Date.now() + 2 * 60 * 1000);

            await addOrder({
                userId: (!role ? 1 : role[1]), //Default 1
                customerName: customerName,
                status: true, // Default true,
                priority: isPriority ? 1 : 0, // If priority is selected, set to 1, otherwise set to 0,
                deliveryTime: deliveryTime.toISOString(), // Formatting time to ISO
                cartContent: cart.map(item => ({ pizzaId: item.pizzaId, name: item.name, quantity: item.quantity, total: parseFloat(item.total) })), // Content of the cart
                totalAmount: parseFloat(totalAmount), // Total order price,
                prioAmount: (parseFloat(totalAmount) * 0.15).toFixed(2), // Price for priority
            });


            setCustomerName("");
            setIsPriority(false);
            onCartRefresh();
        } catch (error) {
            console.error('Błąd podczas wysyłania zamówienia:', error);
        }
    };


    return (
        <div>
            {role[0] === "" && <div>
                <p> By Złożyć zamówienie należy się zalogować</p>
            </div>}
            {
                role[0] ==="User" &&

                <div className="Order">
            <h2>Twoje zamówienie:</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        {item.name} - Quantity: {item.quantity} - Total: {parseFloat(item.total).toFixed(2)} PLN
                        <button onClick={() => onRemoveFromCart(item.pizzaId)}>❌</button>
                    </li>
                ))}
            </ul>

            <div className="OrderForm">
                <h2>Dodaj zamówienie:</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Imię:
                        <input type="text" name="customerName" value={customerName} onChange={handleInputChange} required/>
                    </label>
                    <label>
                        Priorytet:
                        <input type="checkbox" name="isPriority" checked={isPriority} onChange={handleInputChange}/>
                    </label>

                    <button type="submit">Dodaj zamówienie</button>
                </form>
            </div>

                    <div className="OrderSummary">
                    <h2>Podsumowanie:</h2>
                <p>Total: { parseFloat(totalAmount).toFixed(2) } PLN</p>

            </div>
        </div>
            }
            {
                role[0] === "Admin" &&
                <div>
                    <AllZamowienia/>
                </div>
            }
        </div>
    );
}

export default Order;
