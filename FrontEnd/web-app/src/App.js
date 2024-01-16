// App.js

//TODO Rejestracja
//TODO Logowanie
//TODO funkcjonalności w zależności od statusu użytkownika
//TODO cookies tych zamówień bo jak f5 to deadage jest narazie
//TODO engliszyfaj łebsajt

import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";


import "./App.css";
import "./styles/styles.css";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Header from "./components/Header";
import Order from "./components/Order";
import AllDataPage from "./components/AllDataPage";
import EditPizza from "./components/EditPizza";
import EditIngredients from "./components/EditIngredients";
import AddPizza from "./components/AddPizza";
import NavBar from "./components/NavBar";

function App() {

    const [cart, setCart] = useState([]);

    const handleAddToCart = (pizza) => {
        // filtruje koszyk w poszukiwaniu pizzy o tym id
        const existingPizzaIndex = cart.findIndex((item) => item.pizzaId === pizza.pizzaId);

        if (existingPizzaIndex !== -1) {
            // jak jest to zwiększam quantity i total
            const updatedCart = [...cart];
            updatedCart[existingPizzaIndex].quantity += 1;
            updatedCart[existingPizzaIndex].total += pizza.unitPrice;
            setCart(updatedCart);
        } else {
            //jak nie ma pizzy to dodaje ją i daje quantity 1 i total jako cene unit
            setCart((prevCart) => [...prevCart, { ...pizza, quantity: 1, total: pizza.unitPrice }]);
        }
        console.log(`Dodano pizzę ${pizza.pizzaId} do koszyka`)
    };

    const handleRemoveFromCart = (pizzaId) => {
        //filtruje poprzedni koszyk bez tego id podanego
        setCart((prevCart) => prevCart.filter((item) => item.pizzaId !== pizzaId));
        console.log(`Usunięto Pizza ${pizzaId} z koszyka`);
    };


    const handlePlaceOrder = async () => {
        try {
            // TODO zrobić składanie zamówień xddd

            console.log('Zamówienie zostało złożone, koszyk został wyczyszczony.');
        } catch (error) {
            console.error('Błąd podczas składania zamówienia:', error);
        }
    };


    return (
        <React.Fragment>
            <Header />
            <div className={"App"}>
                <Router>
                    <Routes>
                        <Route
                            path={'/na20'}
                            element={
                                <React.Fragment>
                                    <NavBar />
                                    <AllDataPage/>
                                </React.Fragment>
                        }
                        />
                        <Route
                            path={"/"}
                            element={
                                <React.Fragment>
                                    <NavBar />
                                    <Menu
                                        onAddToCart={handleAddToCart}
                                    />
                                    <Cart
                                        cart={cart}
                                        onRemoveFromCart={handleRemoveFromCart}
                                        onPlaceOrder={handlePlaceOrder}
                                    />
                                </React.Fragment>
                        }
                        />
                        <Route
                            path="/order"
                            element={
                                <React.Fragment>
                                    <NavBar />
                                    <Order
                                        cart={cart}
                                        onRemoveFromCart={handleRemoveFromCart}
                                    />
                                </React.Fragment>
                        }
                        />
                        <Route
                            path="/pizza/:id"
                            element={
                                <React.Fragment>
                                    <NavBar />
                                    <EditPizza />
                                </React.Fragment>
                        }
                        />
                        <Route
                            path="/pizza/:id/s"
                            element={
                                <React.Fragment>
                                    <NavBar />
                                    <EditIngredients />
                                </React.Fragment>
                        }
                        />
                        <Route
                            path="/pizza/add"
                            element={
                                <React.Fragment>
                                    <NavBar />
                                    <AddPizza />
                                </React.Fragment>
                        }
                        />
                    </Routes>
                </Router>
            </div>
        </React.Fragment>
    );
}

export default App;