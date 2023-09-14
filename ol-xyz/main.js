import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs([
  ['EPSG:2263', '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'],
  ['EPSG:6539', '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs']
]);
register(proj4);

const pole = proj4('EPSG:2263', 'EPSG:3857', [994949, 149776]);
const view = new View({
  center: pole,
  zoom: 18
});
const feature = new Feature({geometry: new Point(pole)});
const source = new Source({});
const layer = new Layer({source});
source.addFeature(feature);

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://maps{1-4}.nyc.gov/xyz/1.0.0/carto/basemap/{z}/{x}/{y}.jpg'
      })
    }),
    layer
  ],
  view
});
