import { useState, useEffect, useCallback } from "react";
import taxonomyMap from '../../data/TaxonomyMap';

const getAllTaxonomyGuids = (locations) => new Set(
    locations
        .filter(e => !!e.AdditionalTaxonomyTags)
        .map(e => e.AdditionalTaxonomyTags
                    .replace(/[{}]/g, '')
                    .split('|')
        )
        .flat()
);

const LocationFilter = ({ locations, onSelectionChange, onLocationChange, onSearchChange }) => {
    const [allTaxonomyGuids, setAllTaxonomyGuids] = useState(new Set());
    const [selectedTaxonomies, setSelectedTaxonomies] = useState(new Set());

    useEffect(() => {
        setAllTaxonomyGuids(getAllTaxonomyGuids(locations));
    }, []);

    const updateSelectedTaxonomies = useCallback((taxonomy, selected) => {
        if (selected.has(taxonomy)) selected.delete(taxonomy);
        else selected.add(taxonomy);
    
        setSelectedTaxonomies(selected);
        onSelectionChange && onSelectionChange(selected);
    }, [onSelectionChange]);

    const setToCurrentLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            if (!position || !position.coords) return;
            onLocationChange && onLocationChange({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        })
    }, [onLocationChange]);

    const updateSearchString = useCallback((e) => {
        onSearchChange && onSearchChange(e.target.value);
    }, [onSearchChange]);

    return (
        <section className="locationFilter">
            <button onClick={() => setToCurrentLocation()}>Use Current Location</button>
            <h1>Refine Results</h1>
            <div>
                <input type="search" onChange={updateSearchString} placeholder="Search Locations" />
            </div>
            <ul>
                {
                    Array.from(allTaxonomyGuids).map((e, c) => (
                        taxonomyMap[e] &&
                        <li key={`taxonomy${c}`}>
                            <label>
                                <input onChange={() => updateSelectedTaxonomies(e, selectedTaxonomies)} type="checkbox" defaultChecked={selectedTaxonomies.has(e)} /> { taxonomyMap[e] }
                            </label>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default LocationFilter;