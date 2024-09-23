import {
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
import LocationSnapshot from '../datamodels/location-snapshot';
import { LeafletMarketInterval } from './leaflet-filter';
import HoverCircleMarker from './hover-circle-marker';
// Might need this
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { Icon } from 'leaflet';

// Define an interface for props
export interface LeafletWrapperProps {
	markerInterval: LeafletMarketInterval;
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

	return (
		<>
			<div id="map" style={{ width: '100%', height: '100%' }}>
				<MapContainer
					center={STARTING_COORDINATES}
					zoom={13}
					preferCanvas={true}
					style={{ height: '100%', minHeight: '100%' }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker
						position={STARTING_COORDINATES}
						icon={
							new Icon({
								iconUrl: markerIconPng,
								iconSize: [25, 41],
								iconAnchor: [12, 41],
							})
						}
					>
						<Popup>Downtown Toronto</Popup>
					</Marker>

					<FeatureGroup ref={featureGroupRef}>
						{props.timestampInformation.map((coord, index, array) => {
							let index_offset = 1;

							if (props.markerInterval === LeafletMarketInterval.SMALL) {
								index_offset = 10;
								if (!(index % 10 === 0)) {
									return null;
								}
							}
							if (props.markerInterval === LeafletMarketInterval.MEDIUM) {
								index_offset = 50;
								if (!(index % 50 === 0)) {
									return null;
								}
							}
							if (props.markerInterval === LeafletMarketInterval.LARGE) {
								index_offset = 100;
								if (!(index % 100 === 0)) {
									return null;
								}
							}

							const currCenter = new LatLng(
								coord.latitude ?? 0,
								coord.longitude ?? 0
							);

							const prevCenter =
								index == 0
									? currCenter
									: new LatLng(
											array[Math.max(0, index - index_offset)].latitude ?? 0,
											array[Math.max(0, index - index_offset)].longitude ?? 0
									  );

							return (
								<div key={index + '_' + coord.snapshotTimeISOString}>
									<Polyline positions={[prevCenter, currCenter]}></Polyline>

									<HoverCircleMarker
										locationSnapshot={coord}
									></HoverCircleMarker>
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
