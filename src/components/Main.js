import React, { Component } from 'react';
import {  GoogleApiWrapper } from 'google-maps-react';








class Main extends Component {



render()  {



  return (

     <div >

     </div>
    );

  }
}



export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY,
})(Main)