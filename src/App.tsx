import { useState } from 'react';
import './App.css';
import LeafletWrapper from './leaflet/leaflet-map';
import LocationSnapshot from './datamodels/location-snapshot';
import UserLoginForm from './authentication/user-login-form';
import LeafletFilter, { LeafletMarketInterval } from './leaflet/leaflet-filter';
import { marker } from 'leaflet';

function App() {
	const [timestampInformation, setTimestampInformation] = useState<
		LocationSnapshot[]
	>([]);

	const [uid, setUid] = useState('');

	const [markerInterval, setMarkerInterval] = useState<LeafletMarketInterval>(
		LeafletMarketInterval.NONE
	);

	return (
		<>
			<UserLoginForm uid={uid} setUid={setUid}></UserLoginForm>

			<br />

			<LeafletFilter
				uid={uid}
				setTimestampInformation={setTimestampInformation}
				setMarkerInterval={setMarkerInterval}
			></LeafletFilter>

			<LeafletWrapper
				markerInterval={markerInterval}
				timestampInformation={timestampInformation}
			></LeafletWrapper>
		</>
	);
}

export default App;
