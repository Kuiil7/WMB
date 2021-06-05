import React from 'react';
import beer_mug from "../images/beer_mug.png"


 function Main () {


const HeroTitle = <h1></h1>
  const HeroBanner = <div className="hero-body has-background-primary">
  <img src={beer_mug} style={{height:"150px"}} alt="jug beer foamy" />
  <p class="title has-text-white">
    Where's My Beer?
    </p>
    <p class="subtitle has-text-white">
     A US-based beer searching app powered by Open BreweryDB and Google Maps API
    </p>
  </div>


    return <div className="content has-text-centered">

<div className="columns">
<div className="column">
{HeroBanner}
</div>
</div>



<footer>
<strong>Where's My Beer</strong> created by <a href="https://github.com/Kuiil7">🤙🏾Kuiil7</a>.
<br />
Powered by: <a href="https://www.openbrewerydb.org/
" className="pr-1">Open Brewery DB.</a>
Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>.
</footer>


  </div>

}

export default Main;