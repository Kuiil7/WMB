import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';

import Main from './components/Main';
import HeroBanner from './components/HeroBanner';
import Footer from './components/Footer';

ReactDOM.render(
  <BrowserRouter>
  <HeroBanner />
  <Main />
  <Footer />

</BrowserRouter>,
  document.getElementById('root')
);


