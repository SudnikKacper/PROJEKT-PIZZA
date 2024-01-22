import React, {useEffect, useState} from "react";
import { getAllData } from "../services/API";
import "../styles/styles.css"
import useCookies from "./useCookies";

function AllDataPage() {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }
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
        <div>
            {
                role[0] === "Admin" &&

                <div className={'AllData'}>
                    <h2>All Data</h2>
                    {allData ? (
                        <pre>{JSON.stringify(allData, null, 2)}</pre>
                    ) : (
                        <p>Loading data...</p>
                    )}
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

export default AllDataPage;