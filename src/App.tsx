import { useState } from 'react';
import './App.css';
import LeafletWrapper from './leaflet/leaflet-map';
import LocationSnapshot from './datamodels/location-snapshot';
import UserLoginForm from './authentication/user-login-form';
import LeafletFilter from './leaflet/leaflet-filter';

function App() {
	const [timestampInformation, setTimestampInformation] = useState<
		LocationSnapshot[]
	>([]);

	const [uid, setUid] = useState('');

	return (
		<>
			<UserLoginForm uid={uid} setUid={setUid}></UserLoginForm>

			<br />

			<LeafletFilter
				uid={uid}
				setTimestampInformation={setTimestampInformation}
			></LeafletFilter>

			<LeafletWrapper
				timestampInformation={timestampInformation}
			></LeafletWrapper>
		</>
	);
}

export default App;
