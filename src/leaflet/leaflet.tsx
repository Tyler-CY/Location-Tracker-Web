import { CircleMarker, FeatureGroup, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { STARTING_COORDINATES } from './constants';
import { LatLng } from 'leaflet';
import { useEffect, useRef } from 'react';



export class TimestampInformation {
    latitude: number;
    longitude: number;
    locationTime: string;
    snapshotTimeUnixEpoch?: number;

    constructor(latitude: number, longitude: number, locationTime: string, snapshotTimeUnixEpoch?: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationTime = locationTime;
        this.snapshotTimeUnixEpoch = snapshotTimeUnixEpoch
    }    
}

// Define an interface for props
export interface LeafletWrapperProps {
    timestampInformation: TimestampInformation[];
}

function LeafletWrapper(props: LeafletWrapperProps) {

    const featureGroupRef = useRef<any>(null);

    const FitToBounds = ({ featureGroupRef }: { featureGroupRef: React.RefObject<any> }) => {
        const map = useMap(); // Access the map instance
      
        useEffect(() => {
          if (featureGroupRef.current && map) {
            const bounds = featureGroupRef.current.getBounds(); // Get bounds of FeatureGroup
            if (bounds.isValid()) {
              map.fitBounds(bounds); // Fit the map view to the bounds
            }
          }
        }, [map, featureGroupRef]); // Run effect when map or featureGroupRef changes
      
        return null; // This component does not render anything
    };

    // Might need this
    // import markerIconPng from "leaflet/dist/images/marker-icon.png"
// import {Icon} from 'leaflet'
    // <Marker position={[lat, lng]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} />
    
    
    return (
        <>
            <div id='map' style={{ width: '100%'}}>
                <MapContainer center={STARTING_COORDINATES} zoom={13} preferCanvas={true} style={{ height: '1000px'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={STARTING_COORDINATES}>
                        <Popup>
                            Downtown Toronto
                        </Popup>
                    </Marker>

                    <FeatureGroup ref={featureGroupRef}>
                        {props.timestampInformation.map(
                            (coord, index, array) => {
                            const currCenter = new LatLng(coord.latitude, coord.longitude);
                            const prevCenter = index == 0 ? currCenter : new LatLng(array[index - 1].latitude, array[index - 1].longitude)
                        
                            return ( 
                                <div key={index + "_" + coord.locationTime}>
                                    <Polyline  positions={[prevCenter, currCenter]}></Polyline>

                                    <CircleMarker center={currCenter} radius={5} fill={true}>
                                        <Popup>
                                            <>
                                                {`Latitude: ${coord.latitude}`} <br/>
                                                {`Longitude: ${coord.longitude}`} <br/>
                                                {`Time: ${coord.locationTime}`}
                                            </>
                                        </Popup>
                                    </CircleMarker>
                                </div>
                            )
                            }
                        )}
                    </FeatureGroup>
                    <FitToBounds featureGroupRef={featureGroupRef} />
                    
                </MapContainer>
            </div>
        </>
    )
}

export default LeafletWrapper