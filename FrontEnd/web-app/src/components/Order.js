// components/Order.js
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
            // Dodaj przewidywaną dostawę jako czas teraz + 2 minuty
            const deliveryTime = new Date(Date.now() + 2 * 60 * 1000);

            await addOrder({
                userId: (!role ? 1 : role[1]), //Domyślnie jest 1
                customerName: customerName,
                status: true, // Domyślnie ustawiamy status na true,
                priority: isPriority ? 1 : 0, // Jeśli priorytet jest zaznaczony, ustawiamy na 1, w przeciwnym razie na 0,
                deliveryTime: deliveryTime.toISOString(), // Formatowanie czasu na ISO
                cartContent: cart.map(item => ({ pizzaId: item.pizzaId, name: item.name, quantity: item.quantity, total: parseFloat(item.total) })),
                totalAmount: parseFloat(totalAmount), // Całkowita cena zamówienia,
                prioAmount: (parseFloat(totalAmount) * 0.15).toFixed(2), // Cena za priorytet
            });

            // Po obsłużeniu formularza, możesz zresetować stany poniżej:
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
                        <input type="text" name="customerName" value={customerName} onChange={handleInputChange} />
                    </label>
                    <label>
                        Priorytet:
                        <input type="checkbox" name="isPriority" checked={isPriority} onChange={handleInputChange} />
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
