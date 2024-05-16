import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import {useGeographic} from 'ol/proj';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { Attribution } from 'ol/control';
import Tile from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import Vector from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Circle, Fill, Style } from 'ol/style';


useGeographic();
const center = [-2.01667 , 48.650002];

const stylePoint = new Style({
                              image: new Circle({
                                  radius: 8,
                                  fill: new Fill({
                                      color: '#7C1B15'
                                  })
                              })
                          })

var f1 = new Feature({
                  name: 'Feuilles mortes avec humus',
                  category: 'Jardinage',
                  subcategory: 'Amendement',
                  usage: 'Amendement pour compost, paillage',
                  author: 'Julien L',
                  geometry: new Point([ -2.009217,48.623529])
                });
f1.setStyle(stylePoint);

var f2 = new Feature({
                  name: 'Taupinières',
                  category: 'Jardinage',
                  subcategory: 'Amendement',
                  usage: 'Amendement pour terreau, lasagne et autres',
                  author: 'Julien L',
                  geometry: new Point([ -2.011048496699721, 48.62070693190694])
                });
f2.setStyle(stylePoint);

var f3 = new Feature({
                  name: 'Crottin de cheval',
                  category: 'Jardinage',
                  subcategory: 'Amendement',
                  usage: 'Amendement',
                  author: 'Julien L',
                  geometry: new Point([ -2.010333264741102, 48.62226618317582])
                });
f3.setStyle(stylePoint);

var f4 = new Feature({
                  name: 'Vers de sable',
                  category: 'Pêche',
                  subcategory: 'Appâts',
                  usage: 'Appâts pour la pêche',
                  author: 'Julien L',
                  geometry: new Point([ -2.014358883009655, 48.62730113628342])
                });
f4.setStyle(stylePoint);

const layer = new Vector({
     source: new VectorSource({
         features: [f1,f2,f3,f4]
     })
 });

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public map!: Map
  ngOnInit(): void {
    this.map = new Map({
                         controls: defaultControls({ attribution: false }).extend([new Attribution({
                                                                                      collapsible: false
                                                                                   })]),
                         layers: [
                             new Tile({
                                 source: new OSM()
                             })
                         ],
                         target: 'map',
                         view: new View({
                             center: center,
                             maxZoom: 18,
                             zoom: 14
                         })
                      });
    this.map.addLayer(layer);
    var container = document.getElementById('popup') as HTMLElement;
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new Overlay({
       element: container,
       autoPan: true,
       autoPanAnimation: {
           duration: 250
       }
    });
    this.map.addOverlay(overlay);

    if (content && closer) {
       closer.onclick = function() {
           overlay.setPosition(undefined);
           if (closer !== null) {
               closer.blur();
           }
           return false;
       };
    }

    this.map.on('singleclick', function (this:Map, event) {
        if (this.forEachFeatureAtPixel(event.pixel, function (feature) {
            return true;
        }) === undefined) {
            overlay.setPosition(undefined);
            return;
        }

        var feature = this.forEachFeatureAtPixel(event.pixel, function (feature) {
            var coordinate = event.coordinate;
            if (content !== null) {
                content.innerHTML = '<b>'+feature.get('name')+'</b><br /><b>Catégorie : </b>'+feature.get('category')
                +'<br /><b>Sous-catégorie : </b>'+feature.get('subcategory')+'<br /><b>Utilisation : </b>'
                +feature.get('usage')+'<br /><b>Auteur : </b>'+feature.get('author');
            }
            overlay.setPosition(coordinate);
        });
    });
  }
}
