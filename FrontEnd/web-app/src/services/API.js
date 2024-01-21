export const getMenu = async () => {
    try {
        const response = await fetch('http://localhost:9951/getAll/Pizze', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(
                `Błąd ładowania menu: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();

        // Weryfikacja struktury danych
        if (!isValidMenuData(data)) {
            throw new Error('Nieprawidłowa struktura danych otrzymana dla menu.');
        }

        return data;
    } catch (error) {
        console.error("Błąd ładowania menu:", error.message);
        throw error;
    }
};

const isValidMenuData = (menuData) => {
    // Sprawdzanie czy każda pizza w menu posiada oczekiwane elementy
    const expectedKeys = ['pizzaId', 'nazwa_pizzy', 'cena', 'img', 'skladniki'];

    for (const pizza of menuData) {
        for (const key of expectedKeys) {
            if (!(key in pizza)) {
                console.error(`Brak oczekiwanego klucza dla pizzy w menu: ${key}`);
                return false;
            }
        }

        // Weryfikacja struktury składników dla każdej pizzy
        if (!isValidIngredientsData(pizza.skladniki)) {
            return false;
        }
    }

    return true;
};

const isValidIngredientsData = (ingredientsData) => {
    // Sprawdzanie czy każdy składnik posiada oczekiwane elementy
    const expectedKeys = ['skladnikId', 'nazwa_skladnika'];

    for (const ingredient of ingredientsData) {
        for (const key of expectedKeys) {
            if (!(key in ingredient)) {
                console.error(`Brak oczekiwanego klucza dla składnika w menu: ${key}`);
                return false;
            }
        }
    }

    return true;
};

export const getAllData = async () => {
    try {
        const response = await fetch('http://localhost:9951/getAllRecords', {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );

        if (!response.ok) {
            throw new Error(
                `Błąd w łądowaniu wszystkich danych do AllData: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();

        if (!isValidDataStructure(responseData)) {
            throw new Error('Nieprawidłowa struktura otrzymanych danych z serwera API')
        }

        return responseData;
    } catch (error) {
        console.error('Błąd w łądowaniu wszystkich danych do AllData:', error);
        throw error;
    }
};

const isValidDataStructure = (data) => {
    // Sprawdzenie czy data posiada konkretne elementy
    const expectedKeys = ['Pizza', 'PizzaSkladniki', 'Skladniki', 'User', 'Zamowienie', 'ZamowionePrzedmioty'];

    for (const key of expectedKeys) {
        if (!(key in data)) {
            console.error(`Brak oczekiwanego klusza: ${key}`);
            return false
        }
    }

    return true;
}

export const getPizzaById = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd ładowania po id: ${response.status} - ${response.statusText}`);
        }

        const pizzaData = await response.json();

        // Weryfikacja struktury danych
        if (!isValidPizzaData(pizzaData)) {
            throw new Error('Nieprawidłowa struktura danych otrzymana dla pizzy.');
        }

        return pizzaData;
    } catch (error) {
        console.error("Błąd ładowania po id:", error);
        throw error;
    }
};

const isValidPizzaData = (pizzaData) => {
    // Sprawdzanie czy JSON ma takie elementy
    const expectedKeys = ['id', 'nazwa', 'cena', 'img', 'dostepne'];

    for (const key of expectedKeys) {
        if (!(key in pizzaData)) {
            console.error(`Brak oczekiwanego klucza dla pizzy: ${key}`);
            return false;
        }
    }


    return true;
};

export const updatePizza = async (pizzaId, updatedPizza) => {

    try {

        // Sprawdzamy czy jest poprawna struktura przed wysłaniem
        if (!isValidPizzaUpdateData(updatedPizza)) {
            throw new Error('Nieprawidłowa struktura danych dla aktualizacji pizzy.');
        }

        const response = await fetch(`http://localhost:9951/updatePizza/${pizzaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPizza),
        });

        if (!response.ok) {
            throw new Error(
                `Błąd aktualizacji pizzy: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error("Błąd aktualizacji pizzy:", error);
        throw error;
    }
};


const isValidPizzaUpdateData = (updatedPizza) => {
    // Sprawdzenie czy obiekt posiada oczekiwane elementy
    const expectedKeys = ['id', 'nazwa', 'cena', 'img', 'dostepne'];

    for (const key of expectedKeys) {
        if (!(key in updatedPizza)) {
            console.error(`Brak oczekiwanego klucza dla aktualizacji pizzy: ${key}`);
            return false;
        }
    }


    return true;
};

export const getPizzaAndIngredients = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}/s`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd ładowania pizzy i składników: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();

        // Weryfikacja struktury danych
        if (!isValidPizzaAndIngredientsData(responseData)) {
            throw new Error('Nieprawidłowa struktura danych otrzymana dla pizzy i składników.');
        }

        return responseData;
    } catch (error) {
        console.error('Błąd ładowania pizzy i składników:', error);
        throw error;
    }
};

const isValidPizzaAndIngredientsData = (data) => {
    // Sprawdzanie czy pizza posiada oczekiwane elementy
    const expectedKeys = ['pizzaName', 'ingredients'];

    for (const key of expectedKeys) {
        if (!(key in data)) {
            console.error(`Brak oczekiwanego klucza dla pizzy i składników: ${key}`);
            return false;
        }
    }

    // Weryfikacja struktury danych dla składników
    if (!isValidIngredientsData2(data.ingredients)) {
        return false;
    }

    return true;
};

const isValidIngredientsData2 = (ingredientsData) => {
    // Sprawdzanie czy każdy składnik posiada oczekiwane elementy
    const expectedKeys = ['id', 'nazwa', 'selected'];

    for (const ingredient of ingredientsData) {
        for (const key of expectedKeys) {
            if (!(key in ingredient)) {
                console.error(`Brak oczekiwanego klucza dla składnika w danych pizzy i składników: ${key}`);
                return false;
            }
        }
    }

    return true;
};

export const updatePizzaIngredients = async (pizzaId, selectedIngredients) => {
    try {
        const expectedKey = ['ingredients'];
        // Sprawdzanie czy składnik posiada poprawny element
        for (const key in expectedKey) {
            if (!(key in selectedIngredients)) {
                throw Error('Brak oczekiwanego klucza dla aktualizacji skłądników')
            }
        }

        await fetch(`http://localhost:9951/updatePizzaIngredients/${pizzaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
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
        const pizzaExists = await checkPizzaExists(pizzaId);

        if (!pizzaExists) {
            throw new Error(`Pizza o identyfikatorze ${pizzaId} nie istnieje.`);
        }


        const response = await fetch(`http://localhost:9951/deletePizza/${pizzaId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(
                `Błąd usuwania pizzy: ${response.status} - ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Błąd usuwania pizzy:", error.message);
        throw error;
    }
};
const checkPizzaExists = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            return false;
        }

        const pizzaData = await response.json();
        return !!pizzaData; // Zwraca true, jeśli pizza istnieje, a false w przeciwnym razie
    } catch (error) {
        console.error("Błąd weryfikacji istnienia pizzy:", error.message);
        throw error;
    }
};

export const addPizza = async (pizzaData) => {
    try {
        // Weryfikacja struktury danych przed wysłaniem
        if (!isValidPizzaDataForAdd(pizzaData)) {
            throw new Error('Nieprawidłowa struktura danych dla dodawania pizzy.');
        }

        const response = await fetch("http://localhost:9951/addPizza", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pizzaData),
        });

        if (!response.ok) {
            throw new Error(`Błąd dodawania pizzy: ${response.status} - ${response.statusText}`);
        }

        console.log("Pizza dodana");

        await getMenu();
    } catch (error) {
        console.error("Błąd dodawania pizzy:", error);
        throw error;
    }
};

const isValidPizzaDataForAdd = (pizzaData) => {
    // Sprawdź, czy obiekt posiada oczekiwane elementy
    const expectedKeys = ['nazwa', 'cena', 'img', 'dostepne', 'skladniki'];

    for (const key of expectedKeys) {
        if (!(key in pizzaData)) {
            console.error(`Brak oczekiwanego klucza dla dodawania pizzy: ${key}`);
            return false;
        }
    }

    // Sprawdź, czy skladniki to tablica
    if (!Array.isArray(pizzaData.skladniki)) {
        console.error('Pole "skladniki" powinno być tablicą.');
        return false;
    }

    // Sprawdź, czy elements w tablicy składników są liczbami
    if (!pizzaData.skladniki.every((element) => typeof element === 'number')) {
        console.error('Wszystkie elementy w tablicy "skladniki" powinny być liczbami.');
        return false;
    }

    return true;
};