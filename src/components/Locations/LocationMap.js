import { useState, useEffect } from 'react'
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '50%',
  height: '400px'
};

const center = {
  lat: 41.23685,
  lng: -75.89145
};

const LocationMap = ({ locations, selectedLocation, defaultCenter, defaultZoom }) => {
    const [mapCenter, setMapCenter] = useState(defaultCenter || center);
    const [selectedMarker, setSelectedMarker] = useState();

    return (
        <LoadScript 
          googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={11}
          >
            
          </GoogleMap>
        </LoadScript>
      )
}

export default LocationMap;