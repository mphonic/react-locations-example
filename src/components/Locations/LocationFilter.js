import { useState, useEffect, useCallback } from "react";
import taxonomyMap from '../../data/TaxonomyMap';

// const getAllTaxonomyGuids = (locations) => locations.map(e => console.log(e.AdditionalTaxonomyTags, e.AdditionalTaxonomyTags.replace(/[\{\}]/g, '')));
const getAllTaxonomyGuids = (locations) => Array.from(new Set(locations.filter(e => !!e.AdditionalTaxonomyTags).map(e => e.AdditionalTaxonomyTags.replace(/[{}]/g, '').split('|')).flat()));

const LocationFilter = ({ locations, onSelectionChange, onLocationChange }) => {
    const [allTaxonomyGuids, setAllTaxonomyGuids] = useState([]);
    const [selectedTaxonomies, setSelectedTaxonomies] = useState([]);

    useEffect(() => {
        setAllTaxonomyGuids(getAllTaxonomyGuids(locations));
    }, [locations]);

    const updateSelectedTaxonomies = useCallback((taxonomy, selected) => {
        if (selected.indexOf(taxonomy) < 0) selected.push(taxonomy);
        else selected.some((e, c) => {
            if (e === taxonomy) {
                selected.splice(c, 1);
                return true;
            } else {
                return false;
            }
        });
        setSelectedTaxonomies(selected);
        onSelectionChange && onSelectionChange(selected);
    }, [onSelectionChange]);

    const setToCurrentLocation = useCallback(() =>  {
        navigator.geolocation.getCurrentPosition((position) => {
            if (!position || !position.coords) return;
            onLocationChange && onLocationChange({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    }, [onLocationChange]);

    return (
        <section className="locationFilter">
            <button onClick={() => setToCurrentLocation()}>Use Current Location</button>
            <h1>Refine Results</h1>
            <ul>
                {
                    allTaxonomyGuids.map((e, c) => ( taxonomyMap[e] &&
                        <li key={`taxonomy${c}`}>
                            <label onClick={() => updateSelectedTaxonomies(e, selectedTaxonomies)}>
                                <input type="checkbox" defaultChecked={selectedTaxonomies.indexOf(e) > -1} /> { taxonomyMap[e] }
                            </label>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default LocationFilter;