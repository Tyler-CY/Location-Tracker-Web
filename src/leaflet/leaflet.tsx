import {
	CircleMarker,
	FeatureGroup,
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { STARTING_COORDINATES } from './constants';
import { LatLng } from 'leaflet';
import { useEffect, useRef } from 'react';
import LocationSnapshot from '../datamodels/location_snapshot';

// Define an interface for props
export interface LeafletWrapperProps {
	timestampInformation: LocationSnapshot[];
}

function LeafletWrapper(props: LeafletWrapperProps) {
	const featureGroupRef = useRef<any>(null);

	const FitToBounds = ({
		featureGroupRef,
	}: {
		featureGroupRef: React.RefObject<any>;
	}) => {
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
			<div id="map" style={{ width: '100%' }}>
				<MapContainer
					center={STARTING_COORDINATES}
					zoom={13}
					preferCanvas={true}
					style={{ height: '1000px' }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={STARTING_COORDINATES}>
						<Popup>Downtown Toronto</Popup>
					</Marker>

					<FeatureGroup ref={featureGroupRef}>
						{props.timestampInformation.map((coord, index, array) => {
							const currCenter = new LatLng(
								coord.latitude ?? 0,
								coord.longitude ?? 0
							);
							const prevCenter =
								index == 0
									? currCenter
									: new LatLng(
											array[index - 1].latitude ?? 0,
											array[index - 1].longitude ?? 0
										);

							return (
								<div key={index + '_' + coord.snapshotTimeISOString}>
									<Polyline positions={[prevCenter, currCenter]}></Polyline>

									<CircleMarker center={currCenter} radius={5} fill={true}>
										<Popup>
											<>
												{`Latitude: ${coord.latitude}`} <br />
												{`Longitude: ${coord.longitude}`} <br />
												{`Time: ${coord.snapshotTimeISOString}`}
											</>
										</Popup>
									</CircleMarker>
								</div>
							);
						})}
					</FeatureGroup>
					<FitToBounds featureGroupRef={featureGroupRef} />
				</MapContainer>
			</div>
		</>
	);
}

export default LeafletWrapper;
