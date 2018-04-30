/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

// chroma.js - for manipulating colours.
// (can generate continuous scales like colorbrewer..)
import chroma from 'chroma-js';

import {json as requestJson} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data GeoJSON
//const DATA_URL = 'data/manchester.geojson';
//const DATA_URL = 'data/cardiff.geojson';
const DATA_URL = 'data/cardiff_segments.geojson';
/*
 * colour scale.
 * "green index" colour for range [0, 1].
 *
 *
 * manchester green distribution:
 *
 *
 * quantile(x$V1, probs=seq(0,1,0.1))
 *     0%    10%    20%    30%    40%    50%    60%    70%    80%    90%   100% 
 * 0.0000 0.0236 0.0389 0.0544 0.0716 0.0916 0.1169 0.1503 0.2001 0.2862 0.8945 
 *
 *
 *
 * cardiff vegetation: 
 * > quantile(x$vegetation, seq(0,1,0.1))
 *       0%       10%       20%       30%       40%       50%       60%       70%
 *   0.0000000 0.0008101 0.0149082 0.0364843 0.0635820 0.0982200 0.1448196 0.2085075
 *       80%       90%      100%
 *   0.3044132 0.4721046 0.9999710
 *
 *
 *
 */
var colorScale = (function() {
  // green hues from http://colorbrewer2.org/

  // pink
//  var hue = ['#f7f4f9','#e7e1ef','#d4b9da','#c994c7','#df65b0',
//             '#e7298a','#ce1256','#980043','#67001f'].reverse();

	// red
 // var hue = ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'].reverse();
	// green
//	var hue = ['#ffffff','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c', '#ff0000'/*'#00441b'*/];//.reverse();



	//var hue = ['#ff0000',/*'#e5f5e0','#c7e9c0'*/   /*'#a1d99b','#74c476','#41ab5d'*/ '#238b45','#238b45','#238b45',   '#238b45','#006d2c', '#00441b'].reverse();


	
	// fire (with blue for lowest values.)
  //var hue = ['#555555', '#555555','#ffeda0','#fed976','#feb24c','#fd8d3c',
  //           '#fc4e2a','#e31a1c','#bd0026', '#ff0000'];

  // domain scaled to quantiles.
  //var domain = [0.5,    0.2862, 0.2001, 0.1503, 0.1169, 
  //              0.0916, 0.0716, 0.0544, 0.0389, 0.0236];
  var domain = [0.47, 0.3, 0.2, 0.15, 0.10, 0.05, 0.03, 0.1, 0.005, 0.001];
  //var scale = chroma.scale(hue);//.domain(domain);

	// ppl
	var scale = chroma.scale(['white', 'yellow', 'orange', 'red', 'black']).domain([0.0025, 0]);


	// cars
//var scale = chroma.scale(['white', 'yellow', 'orange', 'red', 'black']).domain([0.5, 0]);

	return function(r) {
    //var z = Math.log(r);
    //return scale(z).alpha((1+r)*128).rgba();
    return scale(r).alpha((1+r)*128).rgba(); 
  }
})();

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({data: response});
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, data} = this.state;
    // mapStyle="mapbox://styles/phil8192/cj5l7sfg126852rmagjutiw2e"
    // mapStyle="mapbox://styles/mapbox/dark-v9"
    // mapStyle="https://raw.githubusercontent.com/jingsam/mapbox-gl-styles/master/Camouflage.json"
    // mapStyle="https://raw.githubusercontent.com/openmaptiles/dark-matter-gl-style/master/style.json"
    // mapbox://styles/mapbox/traffic-night-v2
    return (
      <MapGL
        {...viewport}
        mapStyle="https://raw.githubusercontent.com/jingsam/mapbox-gl-styles/master/Camouflage.json"
        //mapStyle="mapbox://styles/phil8192/cjgmhugmy008l2rqj288139s7" // satellite
        //mapStyle="mapbox://styles/phil8192/cjgmjp7nq00382rox3ibqo85c" // light  
	onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          colorScale={colorScale} />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
