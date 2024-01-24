import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPizzaAndIngredients, updatePizzaIngredients } from "../services/API";
import useCookies from "./useCookies";

const EditIngredients = () => {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role;
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
    const [changesMade, setChangesMade] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPizzaAndIngredients(id);
                setPizza(data);
            } catch (error) {
                console.error('Error loading pizza and ingriditnts:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleCheckboxChange = (skladnikId) => {

        //maps the array of ingredients in the current pizza and then, when it changes, creates a new array of these ingredients
        setPizza((prevPizza) => ({
            ...prevPizza,
            ingredients: prevPizza.ingredients.map((skladnik) =>
                skladnik.id === skladnikId ? { ...skladnik, selected: !skladnik.selected } : skladnik
            ),
        }));
        setChangesMade(true);
    };

    const handleUpdateIngredients = async () => {
        try {
            await updatePizzaIngredients(id, pizza.ingredients.filter((skladnik) => skladnik.selected).map((skladnik) => skladnik.id));

            console.log('Ingredients updated');

            setChangesMade(false);
        } catch (error) {
            console.error('Erred updating ingredients:', error);
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
                    <br/>
                    <button id="saveButton" type="button" onClick={handleUpdateIngredients} disabled={!changesMade}>
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
