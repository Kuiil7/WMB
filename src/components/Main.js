import React, { Component } from 'react';
import { Map, InfoWindow, GoogleApiWrapper, Marker  } from 'google-maps-react';
import { DateTime } from 'luxon';
import NumberFormat from 'react-number-format';

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
         console.log(jsonData)


      });
  };

  infoWindowHandler = (props, marker, e) =>
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

inputChangedHandler = (values) => {
  this.setState({
    userInput: values,
  });
}


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
              onClick={this.infoWindowHandler}
              postal_code={brewery.postal_code}

              />

            )

          }



  <InfoWindow
             marker={this.state.activeMarker}
             visible={this.state.showInfoWindow}
             onClose={this.onCloseWindow}
         >
         <div className="box  container ">
<p className="title pb-2">{this.state.selectedPlace.name}
</p>

<button className="button subtitle is-5 is-focus is-outline  is-success">
{this.state.selectedPlace.brewery_type}
  </button>




<p className="subtitle  p-1">
<i className="fas fa-map-marker-alt pr-2"></i>
 {this.state.selectedPlace.street}, {this.state.selectedPlace.city}, {this.state.selectedPlace.state}, {this.state.selectedPlace.postal_code}, {this.state.selectedPlace.country}
 </p>

<p className="subtitle ">
<i className="fas fa-phone"></i>
 <NumberFormat value={this.state.selectedPlace.phone
} format=" (###) ###-####" displayType="text"/>
 </p>


 <p className="subtitle ">
 <i className="fas fa-globe-americas pr-2"></i>
  <a href= {this.state.selectedPlace.website_url} className=" is-primary is-hovered">
 {this.state.selectedPlace.website_url}
</a>
 </p>

<br />


<p>


</p>
<p className="has-text-right h as-text-grey-lighter is-italic">
Last updated:  {DateTime.fromISO(this.state.selectedPlace.updated_at).toFormat('LLLL dd yyyy')}
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