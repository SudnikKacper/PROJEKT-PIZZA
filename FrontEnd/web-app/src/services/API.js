// services/API.js
//TODO Weryfikacja danych
export const getMenu = async () => {
    try {
        const response = await fetch('http://localhost:9951/getAll/Pizze', {
            headers: {
                'Content-Type': 'application/json',
                'mode': 'no-cors'
            }
        });

        if (!response.ok) {
            throw new Error(
                `Błąd ładowania menu: ${response.status} - ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Błąd ładowania menu:", error.message);
        throw error;
    }
};

export const getAllData = async () => {
    try {
        const response = await fetch('http://localhost:9951/getAllRecords', {
                headers: {
                    'Content-Type': 'application/json',
                    'mode': 'no-cors'
                }
            }
            );

        if (!response.ok) {
            throw new Error(
                `Błąd w łądowaniu wszystkich danych do all data: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Błąd w łądowaniu wszystkich danych do all data:', error);
        throw error;
    }
};

export const getPizzaById = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}`, {
            headers: {
                'Content-Type': 'application/json',
                'mode': 'no-cors'
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd ładowania po id: ${response.status} - ${response.statusText}`);
        }
        const pizzaData = await response.json();
        return pizzaData;
    } catch (error) {
        console.error("Błąd ładowania po id:", error);
        throw error;
    }
};
export const updatePizza = async (pizzaId, updatedPizza) => {

    //nazwa, cena, img, dostepne
    try {
        const response = await fetch(`http://localhost:9951/updatePizza/${pizzaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'mode': 'no-cors'
            },
            body: JSON.stringify(updatedPizza),
        });

        if (!response.ok) {
            throw new Error(
                `Błąd aktualizacji pizzy: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();
        console.log(responseData); // Log the server response
        return responseData;
    } catch (error) {
        console.error("Błąd aktualizacji pizzy:", error);
        throw error;
    }
};

export const getPizzaAndIngredients = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}/s`, {
            headers: {
                'Content-Type': 'application/json',
                'mode': 'no-cors'
            }
        });
        if (!response.ok) {
            throw new Error(`Błąd ładowana pizzy i skądników: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Błą ładowania pizzy i składników:', error);
        throw error;
    }
};

export const updatePizzaIngredients = async (pizzaId, selectedIngredients) => {
    try {
        await fetch(`http://localhost:9951/updatePizzaIngredients/${pizzaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'mode': 'no-cors'
            },
            body: JSON.stringify({ ingredients: selectedIngredients }),
        });
    } catch (error) {
        console.error('Błąd aktualizowania skłądnikó:', error);
        throw error;
    }
};

export const deletePizza = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/deletePizza/${pizzaId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'mode': 'no-cors'
            },
        });

        if (!response.ok) {
            throw new Error(
                `Błąd usuwania pizzy: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Błąd usuwania pizzy:", error.message);
        throw error;
    }
};

export const addPizza = async (pizzaData) => {
    try {
        const response = await fetch("http://localhost:9951/addPizza", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'mode': 'no-cors'
            },
            body: JSON.stringify(pizzaData),
        });

        if (!response.ok) {
            throw new Error(`Błąd dodawania pizzy: ${response.status} - ${response.statusText}`);
        }

        console.log("Pizza dodana");

        //zaktualizowane menu
        const updatedMenu = await getMenu();

        // Wyświetl zaktualizowane menu
        console.log("Zaktualizowane menu:", updatedMenu);
    } catch (error) {
        console.error("Błąd dodawania pizzy:", error);
        throw error;
    }
};