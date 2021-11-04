const LocationDetail = ({ location }) => {
    return (
        <div className="locationDetail">
            <h1>{location.LocationName}</h1>
            <address>
                <div>{location.AddressLine1}</div>
                { location.AddressLine2 && <div>{location.AddressLine2}</div> }
                <div>{location.City}, {location.State} {location.PostalCode}</div>
            </address>
        </div>
    )
}

export default LocationDetail;