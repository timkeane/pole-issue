import olms from 'ol-mapbox-style';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import View from 'ol/View';
import Source from 'ol/source/Vector';
import VectorTileSource from 'ol/source/VectorTile';
import Layer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import GeoJSON from 'ol/format/GeoJSON';
import TopoJSON from 'ol/format/TopoJSON';
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

const osmVector = new VectorTileLayer({
  visible: false,
  source: new VectorTileSource({
    attributions:
      '&copy; OpenStreetMap contributors, Who’s On First, ' +
      'Natural Earth, and osmdata.openstreetmap.de',
    format: new TopoJSON({
      layerName: 'layer',
      layers: ['water', 'roads', 'buildings'],
    }),
    url:
      'https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=' +
      '6PZmA5oqQvGukqAKyokKKQ', // this key will only work if page is served on http://localhost:5173/
  }),
  style: [
    {
      filter: ['==', ['get', 'layer'], 'water'],
      style: {
        'fill-color': '#9db9e8'
      }
    },
    {
      else: true,
      filter: ['all', ['==', ['get', 'layer'], 'roads'], ['get', 'railway']],
      style: {
        'stroke-color': '#7de',
        'stroke-width': 1,
        'z-index': ['number', ['get', 'sort_key'], 0]
      }
    },
    {
      else: true,
      filter: ['==', ['get', 'layer'], 'roads'],
      style: {
        'stroke-color': [
          'match',
          ['get', 'kind'],
          'major_road',
          '#776',
          'minor_road',
          '#ccb',
          'highway',
          '#f39',
          'none'
        ],
        'stroke-width': ['match', ['get', 'kind'], 'highway', 1.5, 1],
        'z-index': ['number', ['get', 'sort_key'], 0]
      },
    },
    {
      else: true,
      filter: [
        'all',
        ['==', ['get', 'layer'], 'buildings'],
        ['<', ['resolution'], 10]
      ],
      style: {
        'fill-color': '#6666',
        'stroke-color': '#4446',
        'stroke-width': 1,
        'z-index': ['number', ['get', 'sort_key'], 0]
      }
    }
  ]
});

let mvt;
olms(
  'map',
  'https://www.arcgis.com/sharing/rest/content/items/df7862bfd7984baab51ff9df8e214278/resources/styles/root.json?f=json'
).then(function (map) {
  const layers = map.getLayers().getArray();
  mvt = layers[layers.length - 1];
  map.setView(view);
  map.addLayer(image);
  map.addLayer(osmVector);
  map.addLayer(sidewalk);
  map.addLayer(building);
  map.addLayer(pole);
});

document.getElementById('img').addEventListener(
  'click', 
  e => {
    image.setVisible(!image.getVisible());
    view.setZoom(20); //max for image
  }
);

document.getElementById('osmv').addEventListener(
  'click', 
  e => {
    osmVector.setVisible(!osmVector.getVisible());
    mvt.setVisible(!mvt.getVisible());
    view.setZoom(17); //max for osm
  }
);
