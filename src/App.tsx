import { useState } from 'react';
import './App.css';
import { UserCredential } from 'firebase/auth';
import LeafletWrapper from './leaflet/leaflet';
import { firebaseSignIn, firebaseSignUp } from './firebase/firebaseAuth';
import {
	getSharePermission,
	getTimestampByDate,
	getTimestampByDateAfterTime,
	getTimestampByDateOld,
} from './firebase/firebaseFirestore';
import LocationSnapshot from './datamodels/location_snapshot';

function App() {
	// const [count, setCount] = useState(0)

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [uid, setUid] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const [lookupDate, setLookupDate] = useState<string>(getTodayDate());
	const [lookupEmail, setLookupEmail] = useState<string>('');
	const [lookupAuthorized, setLookupAuthorized] = useState<boolean | null>(
		null
	);
	const [timestampInformation, setTimestampInformation] = useState<
		LocationSnapshot[]
	>([]);

	const [useOld, setUseOld] = useState<boolean | null>(null);

	function getTodayDate() {
		const today = new Date();

		const year = today.getFullYear();

		// Months are zero-based, so we add 1 and pad with leading zero if necessary
		const month = String(today.getMonth() + 1).padStart(2, '0');

		// Days of the month are 1-based, pad with leading zero if necessary
		const day = String(today.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	const handleLogin = async (e: any) => {
		e.preventDefault();

		const userCredential: UserCredential | null = await firebaseSignIn(
			email,
			password
		);
		setUid(userCredential?.user?.uid ?? '');
	};

	const handleSignUp = async (e: any) => {
		e.preventDefault();

		const userCredential: UserCredential | null = await firebaseSignUp(
			email,
			password
		);
		setUid(userCredential?.user?.uid ?? '');
	};

	const handleSearch = async (e: any) => {
		setIsLoading(true);
		e.preventDefault();

		const cachedTimestampInformation = JSON.parse(
			localStorage.getItem(uid + '_' + lookupDate) ?? '[]'
		) as LocationSnapshot[];
		if (cachedTimestampInformation) {
			console.log('cache found');
			console.log('old timestamps found: ' + cachedTimestampInformation.length);

			let latestTimestamp = 0;
			if (cachedTimestampInformation.length > 0) {
				latestTimestamp =
					cachedTimestampInformation[cachedTimestampInformation.length - 1]
						.snapshotTimeUnixEpoch ?? 0;
			}

			const querySnapshot = await getTimestampByDateAfterTime(
				uid,
				lookupDate,
				latestTimestamp
			);

			if (querySnapshot) {
				const newTimestampInformation: LocationSnapshot[] = [];
				querySnapshot.forEach(doc => {
					const data = doc.data();
					newTimestampInformation.push(
						new LocationSnapshot({
							latitude: data.latitude,
							longitude: data.longitude,
							snapshotTimeISOString: data.snapshotTimeISOString,
						})
					);
				});

				console.log('new timestamps pulled: ' + newTimestampInformation.length);

				const allTimestampInformation = cachedTimestampInformation.concat(
					newTimestampInformation
				);
				localStorage.setItem(
					uid + '_' + lookupDate,
					JSON.stringify(allTimestampInformation)
				);
				setTimestampInformation(allTimestampInformation);
			}

			setIsLoading(false);
			return;
		}

		const querySnapshot = useOld
			? await getTimestampByDateOld(uid, lookupDate)
			: await getTimestampByDate(uid, lookupDate);
		const timestampInformation: LocationSnapshot[] = [];
		if (querySnapshot) {
			querySnapshot.forEach(doc => {
				const data = doc.data();
				timestampInformation.push(
					new LocationSnapshot({
						latitude: data.latitude,
						longitude: data.longitude,
						snapshotTimeISOString: data.snapshotTimeISOString,
					})
				);
			});

			localStorage.setItem(
				uid + '_' + lookupDate,
				JSON.stringify(timestampInformation)
			);
			setTimestampInformation(timestampInformation);
			setIsLoading(false);
		}
	};

	const handleSearchAuthorize = async (e: any) => {
		setIsLoading(true);
		e.preventDefault();

		const querySnapshot = await getSharePermission(uid, lookupEmail);
		if (querySnapshot) {
			console.log(querySnapshot.data());
			setLookupAuthorized(true);
		} else {
			setLookupAuthorized(false);
		}
		setIsLoading(false);
	};

	const handleSearchClear = async (e: any) => {
		e.preventDefault();
		setLookupAuthorized(null);
	};

	return (
		<>
			{/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}

			<form onSubmit={handleLogin}>
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<button type="submit">Sign In</button>
				<button onClick={handleSignUp}>Register</button>
				{uid && uid != '' && 'Logged in'}
			</form>

			<input
				type="email"
				onChange={e => setLookupEmail(e.target.value)}
				value={lookupEmail}
				placeholder="Search user by email"
			/>
			<button onClick={handleSearchAuthorize}>Authorize</button>
			<button onClick={handleSearchClear}>Clear</button>
			{lookupAuthorized && 'Authorized'}
			{!lookupAuthorized && lookupAuthorized != null && 'Permission deined'}

			<br />

			<label>
				<input
					type="checkbox"
					checked={useOld ?? false}
					onChange={() => {
						setUseOld(useOld == null ? true : !useOld);
					}}
				/>
				Check history on or before 2024-09-01
			</label>

			<input
				type="date"
				value={lookupDate}
				onChange={event => {
					console.log(event.currentTarget.value);
					setLookupDate(event.currentTarget.value);
				}}
			></input>
			<button onClick={handleSearch}>Search</button>

			{isLoading && 'Loading...'}

			<LeafletWrapper
				timestampInformation={timestampInformation}
			></LeafletWrapper>
		</>
	);
}

export default App;
