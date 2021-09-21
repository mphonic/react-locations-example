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

    useEffect(() => {
      if (!selectedLocation) return;
      // uncomment if you want to put selected marker in center instead of default map adjustments
      // setMapCenter({ lat: parseFloat(selectedLocation.Latitude), lng: parseFloat(selectedLocation.Longitude) });
      setSelectedMarker(selectedLocation);
    }, [selectedLocation]);

    useEffect(() => {
      setMapCenter(defaultCenter || center);
    }, [defaultCenter]);

    return (
        <LoadScript 
          googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={11}
          >
            { 
                locations.map((e, c) => <Marker key={`marker${c}`} position={{ lat: parseFloat(e.Latitude), lng: parseFloat(e.Longitude) }} onClick={() => setSelectedMarker(e)} />)
            }
            {/* For more control over styling and position of info window, you can use the InfoBox component */}
            {
                selectedMarker && (            
                <InfoWindow
                    position={{ lat: parseFloat(selectedMarker.Latitude), lng: parseFloat(selectedMarker.Longitude) }}
                    onCloseClick={() => setSelectedMarker(null)}
                    options={{ 
                      pixelOffset: new window.google.maps.Size(0, -44)
                    }}
                >
                  <div className="info-window">
                    <h1>{selectedMarker.LocationName}</h1>
                    <address>
                      <div>{selectedMarker.AddressLine1}</div>
                      { selectedMarker.AddressLine2 && <div>{selectedMarker.AddressLine2}</div> }
                      <div>{selectedMarker.City}, {selectedMarker.State} {selectedMarker.PostalCode}</div>
                    </address>
                  </div>
                </InfoWindow>
                )
            }
          </GoogleMap>
        </LoadScript>
      )
}

export default LocationMap;