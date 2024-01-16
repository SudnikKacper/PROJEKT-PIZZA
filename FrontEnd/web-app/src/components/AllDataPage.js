import React, {useEffect, useState} from "react";
import { getAllData } from "../services/API";
import "../styles/styles.css"

function AllDataPage() {
    const [allData, setAllData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllData();
                setAllData(data);
            } catch (error) {
                console.error("Błąd w pobieraniu danych:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={'AllData'}>
            <h2>All Data</h2>
            {allData ? (
                <pre>{JSON.stringify(allData, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );

}

export default AllDataPage;