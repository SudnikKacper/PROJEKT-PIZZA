// components/EditPizza.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {deletePizza, getPizzaById, updatePizza} from "../services/API";
import useCookies from "./useCookies";

function EditPizza() {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }

    // nazwa, cena, img, dostepne
    const { id } = useParams();
    const [pizza, setPizza] = useState({
        nazwa: "",
        cena: 0,
        img: "",
        dostepne: true,
    });

    useEffect(() => {
        const fetchPizzaData = async () => {
            try {
                const pizzaData = await getPizzaById(id);
                setPizza(pizzaData);
            } catch (error) {
                console.error("Błąd łądowania danych pizzy:", error);
            }
        };

        fetchPizzaData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPizza((prevPizza) => ({
            ...prevPizza,
            [name]: value,
        }));
    };
    const handleDeletePizza = async () => {
        try {
            await deletePizza(id);
            console.log("Pizza usunięta");
        } catch (error) {
            console.error("Błąd usuwania pizzy:", error);
        }
    };

    const handleUpdatePizza = async () => {
        try {
            await updatePizza(id, pizza);
            console.log("Pizza została zaktualizowana");
        } catch (error) {
            console.error("Błąd przy aktualizacji pizzy:", error);
        }
    };

    return (
        <div>
            {
                role[0] ==="Admin" &&
                <div>
            <h2>Edytuj pizze</h2>
            <form>
                <button type="button" onClick={handleDeletePizza}>
                    Usuń pizze
                </button>
                <label htmlFor={"nazwa"}>
                    Nazwa:
                    <input
                        type="text"
                        name="nazwa"
                        value={pizza.nazwa}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <br/>
                <label htmlFor={"cena"}>
                    Cena:
                    <input
                        type="number"
                        name="cena"
                        value={pizza.cena}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br/>
                <label htmlFor={"img"}>
                    Obrazek URL:
                    <input
                        type="text"
                        name="img"
                        value={pizza.img}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <br/>
                <label htmlFor={"dostepne"}>
                    Dostępność:
                    <input
                        type="checkbox"
                        name="dostepne"
                        checked={pizza.dostepne}
                        onChange={() =>
                            setPizza((prevPizza) => ({
                                ...prevPizza,
                                dostepne: !prevPizza.dostepne,
                            }))
                        }
                        required
                    />
                </label>
                <br/>
                <button type="button" onClick={handleUpdatePizza}>Zapisz zmiany</button>

            </form>
        </div>
            }
            {
                role[0] !== "Admin" && <div>
                    <p> Brak uprawnień</p>
                </div>
            }
        </div>
    );
}

export default EditPizza;
