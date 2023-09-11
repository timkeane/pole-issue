import Map from '@arcgis/core/Map';
import View from '@arcgis/core/views/MapView';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Graphic from '@arcgis/core/Graphic.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

const pole = proj4('EPSG:2263', 'EPSG:4326', [994949, 149776]);
const point = {
  type: 'point',
  longitude: pole[0],
  latitude:pole[1]
};
const pointGraphic = new Graphic({
  geometry: point,
  symbol: {
    type: 'simple-marker',
    color: [226, 119, 40],
    outline: {
        color: [0, 0, 0],
        width: 1
    }
  }
});
const graphicsLayer = new GraphicsLayer();
graphicsLayer.add(pointGraphic);

const base = new VectorTileLayer({
  style: {
    version: 8,
    sources: {
      esri: {
        type: 'vector',
        url: 'https://www.arcgis.com/sharing/rest/content/items/2ee3ac7f481548c88d53ea50268525e7/resources/styles/root.json?f=json'
      }
    }
  }
});

const map = new Map({});
const view = new MapView({
  container: 'map',
  map,
  center: [pole[1], pole[0]],
  zoom: 18
});

map.add(base);
map.add(graphicsLayer);
