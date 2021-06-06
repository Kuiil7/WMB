import React, { Component } from 'react';
import {  GoogleApiWrapper } from 'google-maps-react';
require('dotenv').config()


const mapStyles = {
  width: '100%',
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

     <div className="column is-three-fifths is-offset-one-fifth">


{SubmitEvent}

     </div>

    );

  }
}



export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY,
})(Main)