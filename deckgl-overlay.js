import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {GeoJsonLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {

      /*
      // manchester
      latitude: 53.480793,
      longitude: -2.242571,
      */
   
      /*
      // walsall
      latitude: 52.578171,
      longitude: -1.980528,
      */

      // cardiff
      latitude: 51.485078, 
      longitude: -3.176800,

      zoom: 11,
      maxZoom: 20,
      //pitch: 55,
      bearing: 0
    };
  }

  _initialize(gl) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });
  }

  render() {
    const {viewport, data, colorScale} = this.props;

    if (!data) {
      return null;
    }

    const layer = new GeoJsonLayer({
      id: 'geojson',
      data,
      fp64: true,
      getFillColor: f => colorScale(0.5*(f.properties.right.segments.vegetation+f.properties.left.segments.vegetation)),
      getRadius: f => Math.max(1, (0.5*(f.properties.right.segments.vegetation+f.properties.left.segments.vegetation))*20)
      //getFillColor: f => colorScale(0.5*(f.properties.right.segments.building+f.properties.left.segments.building)),
      //getRadius: f => Math.max(5, (0.5*(f.properties.right.segments.building+f.properties.left.segments.building))*20) 
      //getFillColor: f => colorScale(Math.max(f.properties.right.segments.car,f.properties.left.segments.car)),
      //getRadius: f => Math.max(10, (Math.max(f.properties.right.segments.car,f.properties.left.segments.car))*40)
      //getFillColor: f => colorScale(Math.max(f.properties.right.segments.sky,f.properties.left.segments.sky)),
      //getRadius: f => Math.max(10, (Math.max(f.properties.right.segments.sky,f.properties.left.segments.sky))*50)

	    //pickable: true,
      //onHover: info => console.log('Hovered:', info)
    });

    return (
      <DeckGL {...viewport} layers={ [layer] } onWebGLInitialized={this._initialize} />
    );
  }
}
