import React, { Component } from 'react';
import { Map, InfoWindow, GoogleApiWrapper, Marker  } from 'google-maps-react';
import { DateTime } from 'luxon';

require('dotenv').config()


const mapStyles = {
  width: '99%',
  height: '100%'
}



class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      brewerySearch: "",
      breweries: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},


    };

  };

  handleOnChange = event => {
    this.setState({
      brewerySearch: event.target.value,

    });

  };


handleSearch = () => {
    this.breweryAPICall(this.state.brewerySearch);

  };

  breweryAPICall = brewerySearch => {

    const searchUrl = `https://api.openbrewerydb.org/breweries/search?query=${brewerySearch}`;

    fetch(searchUrl)
      .then(response => {
        return response.json();
      })
      .then(jsonData => {
        this.setState({
            breweries: jsonData

         });

      });

  };

  infoWindowHendler = (props, marker, e) =>
  this.setState({
  selectedPlace: props,
  activeMarker: marker,
  showInfoWindow: true,

});

onCloseWindow = props => {
 this.setState({
 showInfoWindow: false,
 activeMarker: null
});
};


render()  {




const SubmitEvent = <div className="field is-grouped">
<p className="control is-expanded">
  <input className="input" type="text"  name="text"  placeholder="enter a keyword, city, or state"
 onChange={event => this.handleOnChange(event)} value={this.state.brewerySearch} />
</p>
<p className="control">
  <a className="button is-primary"  onClick={this.handleSearch} >
    Search
  </a>
</p>
</div>

  return (

     <div className="column ">

<div className="column is-three-fifths is-offset-one-fifth">

{SubmitEvent}
</div>


<Map

google={this.props.google}

initialCenter={{
  lat: 38.4528,
  lng: -99.9065
}}
zoom={4}
//onReady={this.onReady}

style={mapStyles}

bounds={this.state.bounds}

>

{


            this.state.breweries.map( (brewery, j) =>

              <Marker
              key={j}
              name={brewery.name}
              street={brewery.street}
              city={brewery.city}
              state={brewery.state}
              brewery_type={brewery.brewery_type}
              country={brewery.country}
              website_url={brewery.website_url}
              phone={brewery.phone}
              updated_at={brewery.updated_at}
              position={{ lat: brewery.latitude, lng: brewery.longitude}}
              onClick={this.infoWindowHendler}
              />
            )
          }



  <InfoWindow
             marker={this.state.activeMarker}
             visible={this.state.showInfoWindow}
             onClose={this.onCloseWindow}
         >
         <div className="box  container ">
<p className="title ">{this.state.selectedPlace.name}
<br />

<button className="button is-focus is-outline  is-success">{this.state.selectedPlace.brewery_type}</button>

</p>

<p className="subtitle p-2 ">{this.state.selectedPlace.street}, {this.state.selectedPlace.city}, {this.state.selectedPlace.state},  {this.state.selectedPlace.country}

<br />

<a href="tel:{this.state.selectedPlace.phone}" className=" is-hovered ">
{this.state.selectedPlace.phone}
</a>



<br />
<a href= {this.state.selectedPlace.website_url} className=" is-primary is-hovered">
{this.state.selectedPlace.website_url}
</a>
</p>
<p>
 <a href="tel:{this.state.selectedPlace.phone}" className=" is-hovered">
{this.state.selectedPlace.phone}
</a>
</p>
<p className="has-text-right h as-text-grey-lighter is-italic">
Last updated:  {DateTime.fromISO(this.state.selectedPlace.updated_at).toFormat('LLL dd yyyy')}
</p>

 </div>
         </InfoWindow>
</Map>

     </div>

    );

  }
}



export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY,
})(Main)