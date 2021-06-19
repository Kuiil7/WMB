import React from 'react';
import beer_mug from "../images/beer_mug.png"


 function HeroBanner () {



    return <div className="column content has-text-centered">

<section className="hero is-small is-primary">
  <div className="hero-body">
  <img src={beer_mug} style={{height:"150px"}} alt="jug beer foamy" />
  <p className="title has-text-white">
    Where's My Beer?
    </p>
    <p className="subtitle has-text-white">
     A US-based beer searching app powered by Open BreweryDB and Google Maps API
    </p>
  </div>
</section>

  </div>

}

export default HeroBanner;