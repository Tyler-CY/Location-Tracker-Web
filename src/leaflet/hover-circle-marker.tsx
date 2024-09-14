import { LatLng } from 'leaflet';
import LocationSnapshot from '../datamodels/location-snapshot';
import { CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';

export interface HoverCircleMarkerProps {
	locationSnapshot: LocationSnapshot;
}

function HoverCircleMarker(props: HoverCircleMarkerProps) {
	const { locationSnapshot } = props;

	const [isClicked, setIsClicked] = useState(false);

	const [onPopup, setOnPopup] = useState(false);
	const onPopupRef = useRef(false);
	useEffect(() => {
		onPopupRef.current = onPopup;
	}, [onPopup]);

	const popupRef = useRef(null);

	// Event handlers
	const handleMouseEnter = (event: { target: { openPopup: () => void } }) => {
		event.target.openPopup();
	};

	const handleMouseLeave = (event: { target: { closePopup: () => void } }) => {
		if (!isClicked) {
			setTimeout(() => {
				if (!onPopupRef.current) event.target.closePopup();
			}, 500);
		}
	};

	const handleClick = (event: { target: { openPopup: () => void } }) => {
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
					<Popup
						ref={popupRef}
						interactive
						eventHandlers={{
							mouseover: () => {
								setOnPopup(true);
							},
							mouseout: e => {
								setOnPopup(false);
								if (!isClicked) e.target.close();
							},
						}}
					>
						<>
							{
								<a
									rel="noopener noreferrer"
									target="_blank"
									href={`https://www.google.com/maps/place/${locationSnapshot.latitude},${locationSnapshot.longitude}`}
								>
									Link to Google Maps
								</a>
							}{' '}
							<br />
							{`Latitude: ${locationSnapshot.latitude}`} <br />
							{`Longitude: ${locationSnapshot.longitude}`} <br />
							{`Speed: ${locationSnapshot.speed?.toFixed(4)} m/s`} <br />
							{`Altitude: ${locationSnapshot.altitude?.toFixed(4)} m`} <br />
							<br />
							{`Time: ${locationSnapshot.snapshotTimeISOString}`}
						</>
					</Popup>
				}
			</CircleMarker>
		</>
	);
}

export default HoverCircleMarker;
