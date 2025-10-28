import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

export const createPoints = (vectorSource: any, pointsData: any[]) => {
  pointsData.forEach(([lng, lat, label]) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
    });
    feature.set('label', label || '-');
    vectorSource.addFeature(feature);
  });
};
