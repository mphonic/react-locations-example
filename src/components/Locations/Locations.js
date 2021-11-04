import { useState, useRef, useCallback, useEffect } from "react";
import distributors from '../../data/Distributors';
import LocationFilter from "./LocationFilter";
import LocationMap from "./LocationMap";
import LocationDetail from "./LocationDetail";
import Pager from "../Utility/Pager";

const itemsPerPage = 20;
const Locations = (props) => {

    return (
        <section>
            <div className="flexDirectionCol">
                {/* <LocationMap />
                <LocationFilter /> */}
            </div>
            <div className="flexDirectionCol">
                {/* list of distributors w/details */}
            </div>
            <div>
                {/* pager */}
            </div>
        </section>
    )
}

export default Locations;