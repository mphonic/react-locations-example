import { useState, useRef, useCallback, useEffect } from "react";
import distributors from '../../data/Distributors';
import LocationFilter from "./LocationFilter";
import LocationMap from "./LocationMap";
import LocationDetail from "./LocationDetail";
import Pager from "../Utility/Pager";

const itemsPerPage = 20;

const filterBySearchString = (searchString, distributors) => {
    if (!searchString) return distributors;
    const filtered = distributors.filter(e => e.LocationName.toLowerCase().indexOf(searchString) > -1 || e.City.toLowerCase().indexOf(searchString) > -1);
    return filtered;
}

const filterByTaxonomies = (taxonomyGuids, distributors) => {
    if (!taxonomyGuids || !taxonomyGuids.size) {
        return distributors;
    }

    const taxonomyGuidsArray = Array.from(taxonomyGuids);

    const filtered = distributors.filter(e => {
        return taxonomyGuidsArray.some(t => {
            return e.AdditionalTaxonomyTags.indexOf(t) > -1;
        });
    });
    return filtered;
};

const Locations = (props) => {
    const [rawDistributors, setRawDistributors] = useState(distributors); // just using static distributors now
    const [filteredDistributors, setFilteredDistributors] = useState(Object.assign([], distributors));
    const [selectedLocation, setSelectedLocation] = useState();
    const [mapCenter, setMapCenter] = useState();
    const [searchString, setSearchString] = useState();
    const [taxonomyGuids, setTaxonomyGuids] = useState(new Set());
    const [startIndex, setStartIndex] = useState(0);
    const scrollTopRoot = useRef();
    const scrollTopList = useRef();

    useEffect(() => {
        let filtered = filterByTaxonomies(taxonomyGuids, rawDistributors);
        filtered = filterBySearchString(searchString, filtered);
        setStartIndex(0);
        setFilteredDistributors(filtered);
    }, [taxonomyGuids, searchString, rawDistributors]);

    useEffect(() => scrollTopRoot.current.scrollIntoView({ behavior: 'smooth' }), [selectedLocation, mapCenter]);

    useEffect(() => scrollTopList.current.scrollIntoView({ behavior: 'smooth' }), [startIndex]);

    const onSearchStringChanged = useCallback((string) => {
        // we might want to introduce some more complex logic here; minimum length, debounce, etc.
        setSearchString(string.trim().toLowerCase());
    }, [setSearchString]);

    return (
        <section ref={scrollTopRoot}>
            <div className="flexDirectionCol">
                <LocationMap locations={rawDistributors} selectedLocation={selectedLocation} defaultCenter={mapCenter} />
                <LocationFilter locations={rawDistributors} onSelectionChange={(guids) => setTaxonomyGuids(new Set(guids))} onLocationChange={(location) => setMapCenter(location)} onSearchChange={(onSearchStringChanged)} />
            </div>
            <div ref={scrollTopList} className="flexDirectionCol">
                {
                    filteredDistributors
                        .slice(startIndex, itemsPerPage + startIndex)
                        .map((e, c) => <LocationDetail key={`location${c}`} location={e} onLocationSelected={(location) => setSelectedLocation(location)} />)
                }
            </div>
            <div>
                <Pager numItems={filteredDistributors.length} defaultIndex={startIndex} itemsPerPage={itemsPerPage} onPageChange={(index) => setStartIndex(index)} />
            </div>
        </section>
    )
}

export default Locations;