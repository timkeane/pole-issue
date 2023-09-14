import olms from 'ol-mapbox-style';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

proj4.defs([
  ['EPSG:2263', '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'],
  ['EPSG:6539', '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs']
]);
register(proj4);

const point = proj4('EPSG:2263', 'EPSG:3857', [994949, 149776]);
const view = new View({
  center: point,
  zoom: 22
});
const feature = new Feature({geometry: new Point(point)});
const source = new Source({});
const pole = new Layer({source});
source.addFeature(feature);

const sidewalk = new Layer({
  source: new Source({
    format: new GeoJSON({
      dataProjection: 'EPSG:2263',
      featureProjection: 'EPSG:3857'
    }),
    url: './sidewalk.json'
  }),
  style: new Style({
    stroke: new Stroke({
      width: 1,
      lineDash: [5, 5],
      color: 'black'
    })
  })
});

const building = new Layer({
  source: new Source({
    format: new GeoJSON({
      dataProjection: 'EPSG:2263',
      featureProjection: 'EPSG:3857'
    }),
    url: './building.json'
  }),
  style: new Style({
    stroke: new Stroke({
      width: 1,
      lineDash: [5, 5],
      color: 'black'
    })
  })
});

const image = new TileLayer({
  source: new XYZ({
    url: 'https://tiles.arcgis.com/tiles/yG5s3afENB5iO9fj/arcgis/rest/services/NYC_Orthos_-_2020/MapServer/tile/{z}/{y}/{x}'
  }),
  visible: false
});


olms(
  'map',
  'https://www.arcgis.com/sharing/rest/content/items/2ee3ac7f481548c88d53ea50268525e7/resources/styles/root.json?f=json'
).then(function (map) {
  map.setView(view);
  map.addLayer(image);
  map.addLayer(sidewalk);
  map.addLayer(building);
  map.addLayer(pole);
});

document.getElementById('img').addEventListener(
  'click', 
  e => {
    image.setVisible(!image.getVisible());
    view.setZoom(20);
  }
);
