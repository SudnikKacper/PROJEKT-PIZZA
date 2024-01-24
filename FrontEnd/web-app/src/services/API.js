export const getMenu = async () => {
    try {
        const response = await fetch('http://localhost:9951/getAll/Pizze', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(
                `Menu loading error: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();

        // Verification of data structure
        if (!isValidMenuData(data)) {
            throw new Error('Incorrect data structure obtained for the menu.');
        }

        return data;
    } catch (error) {
        console.error("Error when loading menu:", error.message);
        throw error;
    }
};

const isValidMenuData = (menuData) => {
    // Checking that each pizza on the menu has the expected elements
    const expectedKeys = ['pizzaId', 'nazwa_pizzy', 'cena', 'img', 'skladniki'];

    for (const pizza of menuData) {
        for (const key of expectedKeys) {
            if (!(key in pizza)) {
                console.error(`No expected key for pizza on the menu: ${key}`);
                return false;
            }
        }

        // Verification of the ingredient structure for each pizza
        if (!isValidIngredientsData(pizza.skladniki)) {
            return false;
        }
    }

    return true;
};

const isValidIngredientsData = (ingredientsData) => {
    // Checking that each component has the expected elements
    const expectedKeys = ['skladnikId', 'nazwa_skladnika'];

    for (const ingredient of ingredientsData) {
        for (const key of expectedKeys) {
            if (!(key in ingredient)) {
                console.error(`No expected key for the component in the menu: ${key}`);
                return false;
            }
        }
    }

    return true;
};

//======================================================================//


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
                `Error loading all data: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();

        if (!isValidDataStructure(responseData)) {
            throw new Error('Incorrect structure of the data received from the API server')
        }

        return responseData;
    } catch (error) {
        console.error('Error when loading allData:', error);
        throw error;
    }
};

const isValidDataStructure = (data) => {
    // Checking whether a date has specific elements
    const expectedKeys = ['Pizza', 'PizzaSkladniki', 'Skladniki', 'User', 'Zamowienie', 'ZamowionePrzedmioty'];

    for (const key of expectedKeys) {
        if (!(key in data)) {
            console.error(`No expected key: ${key}`);
            return false
        }
    }

    return true;
}

//======================================================================//


export const getPizzaById = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Loading error after id: ${response.status} - ${response.statusText}`);
        }

        const pizzaData = await response.json();

        // Verification of data structure
        if (!isValidPizzaData(pizzaData)) {
            throw new Error('Incorrect data structure obtained for pizzas.');
        }

        return pizzaData;
    } catch (error) {
        console.error("Error when getting pizza by id:", error);
        throw error;
    }
};

const isValidPizzaData = (pizzaData) => {
    // Checking whether the JSON has these elements
    const expectedKeys = ['id', 'nazwa', 'cena', 'img', 'dostepne'];

    for (const key of expectedKeys) {
        if (!(key in pizzaData)) {
            console.error(`No expected key for pizzas: ${key}`);
            return false;
        }
    }


    return true;
};

//======================================================================//


export const updatePizza = async (pizzaId, updatedPizza) => {

    try {

        // We check that the structure is correct before sending
        if (!isValidPizzaUpdateData(updatedPizza)) {
            throw new Error('Incorrect data structure for pizza updates.');
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
                `Pizza update error: ${response.status} - ${response.statusText}`
            );
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error("Error when updating pizza:", error);
        throw error;
    }
};

const isValidPizzaUpdateData = (updatedPizza) => {
    // Checking whether the object has the expected elements
    const expectedKeys = ['id', 'nazwa', 'cena', 'img', 'dostepne'];

    for (const key of expectedKeys) {
        if (!(key in updatedPizza)) {
            console.error(`No expected key for pizza update: ${key}`);
            return false;
        }
    }


    return true;
};

//======================================================================//


export const getPizzaAndIngredients = async (pizzaId) => {
    try {
        const response = await fetch(`http://localhost:9951/getPizza/${pizzaId}/s`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error loading pizzas and ingredients: ${response.status} - ${response.statusText}`);
        }

        const responseData = await response.json();

        // Verification of data structure
        if (!isValidPizzaAndIngredientsData(responseData)) {
            throw new Error('Incorrect data structure obtained for pizzas and ingredients.');
        }

        return responseData;
    } catch (error) {
        console.error('Error loading pizzas and ingredients:', error);
        throw error;
    }
};

const isValidPizzaAndIngredientsData = (data) => {
    // Checking that the pizza has the expected elements
    const expectedKeys = ['pizzaName', 'ingredients'];

    for (const key of expectedKeys) {
        if (!(key in data)) {
            console.error(`No expected key for pizzas and ingredients: ${key}`);
            return false;
        }
    }

    // Verification of data structure for components
    if (!isValidIngredientsData2(data.ingredients)) {
        return false;
    }

    return true;
};

const isValidIngredientsData2 = (ingredientsData) => {
    // Checking that each component has the expected elements
    const expectedKeys = ['id', 'nazwa', 'selected'];

    for (const ingredient of ingredientsData) {
        for (const key of expectedKeys) {
            if (!(key in ingredient)) {
                console.error(`Missing expected key for ingredient in pizza and ingredient data: ${key}`);
                return false;
            }
        }
    }

    return true;
};

//======================================================================//


export const updatePizzaIngredients = async (pizzaId, selectedIngredients) => {
    try {
        const expectedKey = ['ingredients'];
        // Checking whether a component has a valid element
        for (const key in expectedKey) {
            if (!(key in selectedIngredients)) {
                throw Error('No expected key for component update')
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
        console.error('Error updating ingredients:', error);
        throw error;
    }
};

//======================================================================//


export const deletePizza = async (pizzaId) => {
    try {
        const pizzaExists = await checkPizzaExists(pizzaId);

        if (!pizzaExists) {
            throw new Error(`Pizza with ID ${pizzaId} does not exist.`);
        }


        const response = await fetch(`http://localhost:9951/deletePizza/${pizzaId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Error when deleting pizza: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error when deleting pizza:", error.message);
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
            throw new Error(`Error checking pizza: ${response.status} - ${response.statusText}`);
        }

        const pizzaData = await response.json();
        return !!pizzaData; // Zwraca true, jeśli pizza istnieje, a false w przeciwnym razie
    } catch (error) {
        console.error("Error when checking if pizza exists:", error.message);
        throw error;
    }
};

//======================================================================//


export const addPizza = async (pizzaData) => {
    try {
        // Verification of data structure before sending
        if (!isValidPizzaDataForAdd(pizzaData)) {
            throw new Error('Incorrect data structure for adding pizzas.');
        }

        const response = await fetch("http://localhost:9951/addPizza", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pizzaData),
        });

        if (!response.ok) {
            throw new Error(`Error loading pizza: ${response.status} - ${response.statusText}`);
        }

        console.log("Pizza added");

        await getMenu();
    } catch (error) {
        console.error("Error when adding pizza:", error);
        throw error;
    }
};

const isValidPizzaDataForAdd = (pizzaData) => {
    // checks if the pizzaData object contains all the expected keys
    const expectedKeys = ['nazwa', 'cena', 'img', 'dostepne', 'skladniki'];

    for (const key of expectedKeys) {
        if (!(key in pizzaData)) {
            console.error(`No expected key for adding pizzas: ${key}`);
            return false;
        }
    }

    // checks whether the 'skladniki' field in the pizzaData object is an array
    if (!Array.isArray(pizzaData.skladniki)) {
        console.error('Field \'skladniki\' should be an array.');
        return false;
    }

    // checks whether all elements in the 'skladniki' array of the pizzaData object are of the number type
    if (!pizzaData.skladniki.every((element) => typeof element === 'number')) {
        console.error('All elements of \'skladniki\' should be a number.');
        return false;
    }

    return true;
};

//======================================================================//


export const addOrder = async (orderData) => {
    try {
        const response = await fetch('http://localhost:9951/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error('Error during adding order:', error);
        throw error;
    }
};

//======================================================================//


export const getAllOrders = async () => {
    try {
        const response = await fetch('http://localhost:9951/getAll/Zamowienia', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(
                `Error loading orders: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error('Error loading orders:', error.message);
        throw error;
    }
};

//======================================================================//


export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await fetch(`http://localhost:9951/updateOrderStatus/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newStatus,
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        const updatedOrderData = await response.json();
        console.log(updatedOrderData);
        return updatedOrderData;
    } catch (error) {
        throw new Error(`Error updating order status: ${error.message}`);
    }
};

//======================================================================//


export const deleteOrder = async (orderId) => {
    try {
        const response = await fetch(`http://localhost:9951/deleteOrder/${orderId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        // Return a success message or any other relevant data
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        throw new Error(`Error deleting order: ${error.message}`);
    }
};

//======================================================================//


export const getAllUserOrders = async (userId) => {
    try {
        const response = await fetch(`http://localhost:9951/getAll/Zamowienia/${userId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(
                `Error loading orders: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error('Error loading orders:', error.message);
        throw error;
    }
};

//======================================================================//


export const register = async (userData) => {
    try {
        const response = await fetch('http://localhost:9951/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        console.log(data);

        return data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

//======================================================================//


export const login = async (loginData) => {
    try {
        const response = await fetch('http://localhost:9951/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
            credentials: 'include',
        });

        const data = await response.json();

        if (data.message) {
            // Handle message accordingly
        } else {
            document.cookie = `role=${data[0].rola}+${data[0].id}; path=/`;
            console.log(data[0].rola);
            console.log(data[0].id);
            // Handle login status accordingly
        }

        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};