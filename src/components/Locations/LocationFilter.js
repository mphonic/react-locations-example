import { useState, useEffect, useCallback } from "react";
import taxonomyMap from '../../data/TaxonomyMap';

const getAllTaxonomyGuids = (locations) => 
    new Set(
        locations
            .filter(e => !!e.AdditionalTaxonomyTags)
            .map(e => e.AdditionalTaxonomyTags
                        .replace(/[{}]/g, '')
                        .split('|')
            )
            .flat()
    );

const LocationFilter = ({ locations, onSelectionChange, onLocationChange }) => {
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

    return (
        <section className="locationFilter">
            <h1>Refine Results</h1>
            <ul>
                {
                    Array.from(allTaxonomyGuids).map((e, c) => (
                        taxonomyMap[e] &&
                        <li key={`taxonomy${c}`}>
                            <label onClick={() => updateSelectedTaxonomies(e, selectedTaxonomies)}>
                                <input type="checkbox" defaultChecked={selectedTaxonomies.has(e)} /> { taxonomyMap[e] }
                            </label>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default LocationFilter;