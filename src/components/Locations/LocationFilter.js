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
    return (
        <section className="locationFilter">
            <button>Use Current Location</button>
            <h1>Refine Results</h1>
            <div>
                <input type="search" placeholder="Search Locations" />
            </div>
            <ul>
      
            </ul>
        </section>
    )
}

export default LocationFilter;