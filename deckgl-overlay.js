import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {GeoJsonLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {
  static get defaultViewport() {
    return {
      latitude: 51.485078, 
      longitude: -3.176800,
      zoom: 12,
      maxZoom: 20,
      pitch: 55, 
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
      getRadius: f => Math.max(1, (0.5*(f.properties.right.segments.vegetation+f.properties.left.segments.vegetation))*40)
    });

    return (
      <DeckGL {...viewport} layers={ [layer] } onWebGLInitialized={this._initialize} />
    );
  }
}
