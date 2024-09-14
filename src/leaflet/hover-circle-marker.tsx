import { LatLng } from 'leaflet';
import LocationSnapshot from '../datamodels/location-snapshot';
import { CircleMarker, Popup } from 'react-leaflet';
import { useState } from 'react';

export interface HoverCircleMarkerProps {
	locationSnapshot: LocationSnapshot;
}

function HoverCircleMarker(props: HoverCircleMarkerProps) {
	const { locationSnapshot } = props;

	const [isClicked, setIsClicked] = useState(false);

	// Event handlers
	const handleMouseEnter = event => {
		event.target.openPopup();
	};

	const handleMouseLeave = event => {
		if (!isClicked) {
			event.target.closePopup();
		}
	};

	const handleClick = event => {
		setIsClicked(true);
		event.target.openPopup();
	};

	return (
		<>
			<CircleMarker
				center={
					new LatLng(
						locationSnapshot.latitude ?? 0,
						locationSnapshot.longitude ?? 0
					)
				}
				radius={5}
				fill={true}
				eventHandlers={{
					mouseover: handleMouseEnter,
					mouseout: handleMouseLeave,
					click: handleClick,
				}}
			>
				{
					<Popup>
						<>
							{`Latitude: ${locationSnapshot.latitude}`} <br />
							{`Longitude: ${locationSnapshot.longitude}`} <br />
							{`Time: ${locationSnapshot.snapshotTimeISOString}`}
						</>
					</Popup>
				}
			</CircleMarker>
		</>
	);
}

export default HoverCircleMarker;
