// components/EditIngredients.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPizzaAndIngredients, updatePizzaIngredients } from "../services/API";
import useCookies from "./useCookies";

const EditIngredients = () => {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }
    const { id } = useParams();
    const [pizza, setPizza] = useState({
        nazwa: "",
        ingredients: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPizzaAndIngredients(id);
                setPizza(data);
            } catch (error) {
                console.error('Błąd ładowania pizzy i skłądników:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleCheckboxChange = (skladnikId) => {

        //mapuje tablicę składników w obecnej pizzy, po czym jak się zmieni to tworzy nową tablicę tych skłądników
        setPizza((prevPizza) => ({
            ...prevPizza,
            ingredients: prevPizza.ingredients.map((skladnik) =>
                skladnik.id === skladnikId ? { ...skladnik, selected: !skladnik.selected } : skladnik
            ),
        }));
    };

    const handleUpdateIngredients = async () => {
        try {
            await updatePizzaIngredients(id, pizza.ingredients.filter((skladnik) => skladnik.selected).map((skladnik) => skladnik.id));

            console.log('Zaktualizowano składniki');
        } catch (error) {
            console.error('Błąd w aktualizacji skadników:', error);
        }
    };

    return (
        <div>
        {
            role[0] ==="Admin" &&
        <div>
            <h2>Edit Ingredients</h2>
            <form>
                <h3>{pizza.nazwa}</h3>
                {pizza.ingredients.map((skladnik) => (
                    <div key={skladnik.id}>
                        <label>
                            {skladnik.nazwa}:
                            <input
                                type="checkbox"
                                checked={skladnik.selected}
                                onChange={() => handleCheckboxChange(skladnik.id)}
                            />
                        </label>
                    </div>
                ))}
                <br />
                <button type="button" onClick={handleUpdateIngredients}>
                    Save Changes
                </button>
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
};

export default EditIngredients;
