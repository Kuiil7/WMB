import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import beer_mug from "./beer_mug.png";

const BrewerySearch = (props) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedBrewery, setSelectedBrewery] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geolocationError, setGeolocationError] = useState(null);

  const fetchBreweryData = async (searchQuery) => {
    console.log('Fetching data for query:', searchQuery); 
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/search?query=${searchQuery}`);
      console.log('Fetched data:', response.data); 
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchBreweryData(query);
  };

  const infoWindowHandler = (props, marker) => {
    setSelectedBrewery(props);
    setActiveMarker(marker);
    setShowInfoWindow(true);

    if (mapInstance) {
      mapInstance.setZoom(15); 
      mapInstance.panTo(marker.position);
    }
  };

  const onCloseWindow = () => {
    setShowInfoWindow(false);
    setActiveMarker(null);
  };

  const onMapReady = (mapProps, map) => {
    console.log('Map instance:', map); 
    setMapInstance(map);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Geolocation position:', position); 
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error); 
          setGeolocationError(error.message);
        }
      );
    } else {
      setGeolocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (mapInstance && data.length) {
      const bounds = new props.google.maps.LatLngBounds();
      data.forEach(brewery => {
        if (brewery.latitude && brewery.longitude) {
          bounds.extend(new props.google.maps.LatLng(brewery.latitude, brewery.longitude));
        }
      });
      mapInstance.fitBounds(bounds);
    }
  }, [data, mapInstance, props.google]);

  if (!userLocation) {

    return <div>Loading user location...</div>;
  }

  return (
    <>
      <section className="hero is-small is-primary content has-text-centered mb-0">
        <div className="hero-body">
          <div className="is-flex is-align-items-center is-justify-content-center">
            <img src={beer_mug} style={{ height: '50px', marginRight: '10px' }} alt="jug beer foamy" />
            <p className="title is-size-4 has-text-white">Where's My Beer?</p>
          </div>
          <p className="subtitle is-size-6 has-text-white">Search breweries, cideries, brewpubs, and bottleshops around the world.</p>
          <form onSubmit={handleSearch}>
            <input
              className="input is-small mr-1 mb-1"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="enter a country, city, state, or postal code"
              style={{ width: "250px" }}
            />
            <input type="submit" className="button is-outlined is-hovered is-small" />
          </form>
          <p className="subtitle is-size-7 has-text-white is-italic">Currently limited to: Austria, England, France, Isle of Man, Ireland, Poland, Portugal, Scotland, Singapore, South Korea, and the United States.</p>
        </div>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error occurred</div>}
        {geolocationError && <div>Error getting location: {geolocationError}</div>}
        {!isLoading && !isError && !geolocationError && (
          <div className='map-container container has-text-left'>
            <Map
              google={props.google}
              zoom={12} 
              initialCenter={userLocation}
              onReady={onMapReady}
              style={{ width: '100%', height: '600px', position: 'relative' }}
            >
              {data.map((brewery, index) => (
                brewery.latitude && brewery.longitude ? (
                  <Marker
                    key={index}
                    position={{ lat: brewery.latitude, lng: brewery.longitude }}
                    onClick={(props, marker, e) => infoWindowHandler(brewery, marker, e)}
                  />
                ) : null
              ))}
              {showInfoWindow && activeMarker && (
                <InfoWindow
                  marker={activeMarker}
                  visible={showInfoWindow}
                  onClose={onCloseWindow}
                >
                  <div>
                    <h2>{selectedBrewery.name}</h2>
                    <p>{selectedBrewery.street}</p>
                    <p>{selectedBrewery.city}, {selectedBrewery.state}, {selectedBrewery.postal_code}</p>
                    <p>{selectedBrewery.country}</p>
                    <p><a href={selectedBrewery.website_url}>{selectedBrewery.website_url}</a></p>
                    <a href={`tel:${selectedBrewery.phone}`}>{selectedBrewery.phone}</a>
                  </div>
                </InfoWindow>
              )}
              <footer className="mt-4 has-text-right">
                <strong>Where's My Beer</strong> created by <a href="https://github.com/Kuiil7">🤙🏾Kuiil7</a>.
                <br />
                Powered by: <a href="https://www.openbrewerydb.org/" className="pr-1">Open Brewery DB.</a>
                Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>.
              </footer>
            </Map>
          </div>
        )}
      </section>
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY,
})(BrewerySearch);
