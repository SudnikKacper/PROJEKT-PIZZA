// components/Menu.js

import React, { useEffect, useState } from "react";
import { getMenu } from "../services/API";
import ReactPaginate from "react-paginate";
import PropTypes from "prop-types";

Menu.protoTypes = {
    onAddToCart: PropTypes.func.isRequired,
};

function MenuItem({ item, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("To nie jest poprawna liczba.");
            return;
        }

        onAddToCart({
            pizzaId: item.pizzaId,
            name: item.nazwa_pizzy,
            quantity: quantity,
            unitPrice: item.cena,
            total: quantity * item.cena,
        });
        setQuantity(1);
    };


    return (
        <div className="ItemCard">
            <div style={{ marginRight: "10px" }}>
                <img
                    src={item.img}
                    alt={item.nazwa_pizzy}
                    style={{ width: "150px", height: "150px", borderRadius: "8px" }}
                />
            </div>
            <div>
                <h4>{item.nazwa_pizzy}</h4>
                <p>Cena: {item.cena} PLN</p>
                <p>
                    {item.skladniki.map((skladnik, index) => (
                        <span key={skladnik.skladnikId}>
              {skladnik.nazwa_skladnika}
                            {index !== item.skladniki.length - 1 ? ", " : ""}
            </span>
                    ))}
                </p>
                <div>
                    <button onClick={handleAddToCart}>Add ➕</button>
                </div>
            </div>
        </div>
    );
}

function PaginationCard({
                            pageCount,
                            handlePageClick,
                            containerClassName,
                            previousLinkClassName,
                            nextLinkClassName,
                            disabledClassName,
                            activeClassName,
                        }) {
    return (
        <div className="PaginationCard">
            <ReactPaginate
                previousLabel={"Poprzednia"}
                nextLabel={"Następna"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={containerClassName}
                previousLinkClassName={previousLinkClassName}
                nextLinkClassName={nextLinkClassName}
                disabledClassName={disabledClassName}
                activeClassName={activeClassName}
            />
        </div>
    );
}

function Menu({onAddToCart }) {
    const [items, setItems] = useState([]);

//--------------------------//--------------------------//--------------------------//--------------------------//
/**/    const itemsPerPage = 2; ///// !!! TU ZMIENIAĆ ILOŚĆ PIZZA NA 1 KARCIE                        /**/
//--------------------------//--------------------------//--------------------------//--------------------------//


    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getMenu();
                setItems(data);
            } catch (error) {
                console.log("Błąd w ładowaniu menu: ", error);
            }
        };

        getData();
    }, []);

    const pageCount = Math.ceil(items.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(0);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const displayItems = items
        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        .map((item) => <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />);


    return (
        <React.Fragment>
            <div className={"menu"}>
                {displayItems}

                <div className="pagination">
                    <PaginationCard
                        pageCount={pageCount}
                        handlePageClick={handlePageClick}
                        containerClassName={"paginationBttns"}
                        previousLinkClassName={"previousBttn"}
                        nextLinkClassName={"nextBttn"}
                        disabledClassName={"paginationDisabled"}
                        activeClassName={"paginationActive"}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

export default Menu;