import { useState, useRef, useCallback } from "react";
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
    const [startIndex, setStartIndex] = useState(0);
    const scrollTopRoot = useRef();
    const scrollTopList = useRef();

    const filterByTaxonomies = useCallback((taxonomyGuids) => {
        setStartIndex(0);
        taxonomyGuids = Array.from(taxonomyGuids);
        if (!taxonomyGuids || !taxonomyGuids.length) {
            setFilteredDistributors([...rawDistributors]);
            return;
        }

        const filtered = rawDistributors.filter(e => {
            let hasMatch = false;
            taxonomyGuids.some(t => {
                hasMatch = e.AdditionalTaxonomyTags.indexOf(t) > -1;
                return hasMatch;
            });
            return hasMatch;
        });
        setFilteredDistributors(filtered);
    }, [rawDistributors]);

    const onLocationSelected = useCallback((location) => {
        setSelectedLocation(location);
        setTimeout(() => scrollTopRoot.current.scrollIntoView({ behavior: 'smooth' }));
    }, []);

    const onPageChange = useCallback((index) => {
        setStartIndex(index);
        setTimeout(() => scrollTopList.current.scrollIntoView({ behavior: 'smooth' }));
    }, []);

    return (
        <section ref={scrollTopRoot}>
            <div className="flexDirectionCol">
                <LocationMap locations={rawDistributors} selectedLocation={selectedLocation} />
                <LocationFilter locations={rawDistributors} onSelectionChange={filterByTaxonomies} />
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