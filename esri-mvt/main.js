import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import proj4 from 'proj4';

proj4.defs([
  ['EPSG:2263', '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'],
  ['EPSG:6539', '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs']
]);

const pole = proj4('EPSG:2263', 'EPSG:4326', [994949, 149776]);
const point = {
  type: 'point',
  longitude: pole[0],
  latitude: pole[1]
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

const sidewalk = new GeoJSONLayer({
  url: './sidewalk.json'
});

const building = new GeoJSONLayer({
  url: './building.json'
});

const image = new WebTileLayer({
  visible: false,
  urlTemplate: 'https://tiles.arcgis.com/tiles/yG5s3afENB5iO9fj/arcgis/rest/services/NYC_Orthos_-_2020/MapServer/tile/{z}/{y}/{x}'
});

const map = new Map({});
const view = new MapView({
  container: 'map',
  map,
  center: pole,
  zoom: 18
});

map.add(base);
map.add(image);
map.add(graphicsLayer);
map.add(sidewalk);
map.add(building);

document.getElementById('img').addEventListener(
  'click', 
  e => {
    image.visible = !image.visible;
    view.setZoom(20);
  }
);