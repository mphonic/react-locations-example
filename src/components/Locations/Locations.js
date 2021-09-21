import { useState, useRef, useCallback, useEffect } from "react";
import distributors from '../../data/Distributors';
import LocationFilter from "./LocationFilter";
import LocationMap from "./LocationMap";
import LocationDetail from "./LocationDetail";
import Pager from "../Utility/Pager";

const itemsPerPage = 20;
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
        performFiltering();
    }, [taxonomyGuids, searchString]);

    const filterByTaxonomies = () => {
        setStartIndex(0);

        if (!taxonomyGuids || !taxonomyGuids.size) {
            setFilteredDistributors([...rawDistributors]);
            return rawDistributors;
        }

        const taxonomyGuidsArray = Array.from(taxonomyGuids);

        const filtered = rawDistributors.filter(e => {
            let hasMatch = false;
            taxonomyGuidsArray.some(t => {
                hasMatch = e.AdditionalTaxonomyTags.indexOf(t) > -1;
                return hasMatch;
            });
            return hasMatch;
        });
        return filtered;
    };

    const filterBySearchString = (distributors) => {
        if (!searchString) return distributors;
        const filtered = distributors.filter(e => e.LocationName.toLowerCase().indexOf(searchString) > -1 || e.City.toLowerCase().indexOf(searchString) > -1);
        return filtered;
    };

    const performFiltering = () => {
        let filtered = filterByTaxonomies();
        filtered = filterBySearchString(filtered);
        setFilteredDistributors(filtered);
    };

    const onTaxonomyChanged = (taxonomyGuids) => {
        setTaxonomyGuids(new Set(taxonomyGuids));
    };

    const onSearchStringChanged = (string) => {
        setSearchString(string.trim().toLowerCase());
    };

    const onLocationSelected = useCallback((location) => {
        setSelectedLocation(location);
        setTimeout(() => scrollTopRoot.current.scrollIntoView({ behavior: 'smooth' }));
    }, []);

    const onPageChange = useCallback((index) => {
        setStartIndex(index);
        setTimeout(() => scrollTopList.current.scrollIntoView({ behavior: 'smooth' }));
    }, []);

    const onLocationChanged = useCallback((location) => {
        setMapCenter(location);
        setTimeout(() => scrollTopRoot.current.scrollIntoView({ behavior: 'smooth' }));
    }, []);

    return (
        <section ref={scrollTopRoot}>
            <div className="flexDirectionCol">
                <LocationMap locations={rawDistributors} selectedLocation={selectedLocation} defaultCenter={mapCenter} />
                <LocationFilter locations={rawDistributors} onSelectionChange={onTaxonomyChanged} onLocationChange={onLocationChanged} onSearchChange={onSearchStringChanged} />
            </div>
            <div ref={scrollTopList} className="flexDirectionCol">
                {
                    filteredDistributors
                        .slice(startIndex, itemsPerPage + startIndex)
                        .map((e, c) => <LocationDetail key={`location${c}`} location={e} onLocationSelected={onLocationSelected} />)
                }
            </div>
            <div>
                <Pager numItems={filteredDistributors.length} defaultIndex={startIndex} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />
            </div>
        </section>
    )
}

export default Locations;