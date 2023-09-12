import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import proj4 from 'proj4';

proj4.defs([
  ['EPSG:2263', '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'],
  ['EPSG:6539', '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs']
]);
register(proj4);

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

var base = new WebTileLayer({
  urlTemplate: 'https://maps{subDomain}.nyc.gov/xyz/1.0.0/carto/basemap/{level}/{col}/{row}.jpg',
  subDomains: ['1', '2', '3', '4']
});
const map = new Map({});
const view = new MapView({
  container: 'map',
  map,
  center: pole,
  zoom: 18
});

map.add(base);
map.add(graphicsLayer);
