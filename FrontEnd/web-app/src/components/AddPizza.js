// components/AddPizza.js
import React, { useState, useEffect } from "react";
import {addPizza, getAllData} from "../services/API";

const AddPizza = () => {
    const [skladniki, setSkladniki] = useState([]);
    const [pizzaData, setPizzaData] = useState({
        nazwa: "",
        cena: 0,
        img: "",
        dostepne: true,
        selectedIngredients: [],
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllData();
                setSkladniki(data.Skladniki);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPizzaData((prevData) => ({
            ...prevData,
            [name]: name === "cena" ? parseFloat(value) : value,
        }));
    };

    const handleCheckboxChange = (skladnikId) => {
        setPizzaData((prevData) => {
            const selectedIngredients = prevData.selectedIngredients.includes(skladnikId)
                ? prevData.selectedIngredients.filter((id) => id !== skladnikId)
                : [...prevData.selectedIngredients, skladnikId];

            return {
                ...prevData,
                selectedIngredients,
            };
        });
    };

    const handleAddPizza = async () => {
        try {
            await addPizza({
                nazwa: pizzaData.nazwa,
                cena: pizzaData.cena,
                img: pizzaData.img,
                dostepne: pizzaData.dostepne,
                skladniki: pizzaData.selectedIngredients,
            });

        } catch (error) {
            console.error("Error adding pizza:", error);
        }
    };

    return (
        <div>
            <h2>Add Pizza</h2>
            <form>
                <label>
                    Name:
                    <input type="text" name="nazwa" value={pizzaData.nazwa} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" name="cena" value={pizzaData.cena} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Image URL:
                    <input type="text" name="img" value={pizzaData.img} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Available:
                    <input type="checkbox" name="dostepne" checked={pizzaData.dostepne} onChange={handleInputChange} />
                </label>
                <br />
                <label>Ingredients:</label>
                {skladniki.map((skladnik) => (
                    <div key={skladnik.id}>
                        <label>
                            {skladnik.nazwa}:
                            <input
                                type="checkbox"
                                checked={pizzaData.selectedIngredients.includes(skladnik.id)}
                                onChange={() => handleCheckboxChange(skladnik.id)}
                            />
                        </label>
                    </div>
                ))}
                <br />
                <button type="button" onClick={handleAddPizza}>
                    Add Pizza
                </button>
            </form>
        </div>
    );
};

export default AddPizza;
