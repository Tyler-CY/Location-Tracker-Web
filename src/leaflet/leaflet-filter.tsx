import { useState } from 'react';
import LocationSnapshot from '../datamodels/location-snapshot';
import {
	getTimestampByDate,
	getTimestampByDateAfterTime,
	getTimestampByDateOld,
} from '../firebase/firebaseFirestore';

// Define an interface for props
export interface LeafletFilterProps {
	uid: string;
	timestampInformation: LocationSnapshot[];
	setTimestampInformation: React.Dispatch<
		React.SetStateAction<LocationSnapshot[]>
	>;
	setMarkerInterval: React.Dispatch<
		React.SetStateAction<LeafletMarketInterval>
	>;
}

export enum LeafletMarketInterval {
	NONE = 'NONE',
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
}

function LeafletFilter(props: LeafletFilterProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const [lookupDate, setLookupDate] = useState<string>(getTodayDate());

	const [useOld, setUseOld] = useState<boolean | null>(null);

	const [useCache, setUseCache] = useState<boolean>(true);
	const [exclamationCount, setExclamationCount] = useState<number>(0);

	const {
		uid,
		timestampInformation,
		setTimestampInformation,
		setMarkerInterval,
	} = props;

	function getTodayDate() {
		const today = new Date();

		const year = today.getFullYear();

		// Months are zero-based, so we add 1 and pad with leading zero if necessary
		const month = String(today.getMonth() + 1).padStart(2, '0');

		// Days of the month are 1-based, pad with leading zero if necessary
		const day = String(today.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	const handleSearch = async (e: any) => {
		if (!uid) {
			setExclamationCount(exclamationCount + 1);
			return;
		}
		setIsLoaded(false);
		setIsLoading(true);
		e.preventDefault();

		if (useCache) {
			const cachedTimestampInformation = JSON.parse(
				localStorage.getItem(uid + '_' + lookupDate) ?? '[]'
			) as LocationSnapshot[];
			if (cachedTimestampInformation) {
				console.log('cache found');
				console.log(
					'old timestamps found: ' + cachedTimestampInformation.length
				);

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
								snapshotTimeUnixEpoch: data.snapshotTimeUnixEpoch,
								speed: data.hasSpeed ? data.speed : null,
								altitude: data.hasAltitude ? data.altitude : null,
							})
						);
					});

					console.log(
						'new timestamps pulled: ' + newTimestampInformation.length
					);

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
				setIsLoaded(true);
				return;
			}
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
						snapshotTimeUnixEpoch: data.snapshotTimeUnixEpoch,
						speed: data.hasSpeed ? data.speed : null,
						altitude: data.hasAltitude ? data.altitude : null,
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
	return (
		<>
			<label>Filter</label>
			<br />
			<label>Date</label>
			<input
				type="date"
				value={lookupDate}
				onChange={event => {
					console.log(event.currentTarget.value);
					setLookupDate(event.currentTarget.value);
					setUseOld(
						new Date(event.currentTarget.value) <= new Date('2024-09-01')
							? true
							: false
					);
				}}
			></input>

			<br />

			<label>Marker Concentration</label>
			<select
				name="marker-interval"
				id="market-interval-dropdown"
				onChange={e => {
					setMarkerInterval(e.target.value as LeafletMarketInterval);
				}}
			>
				<option value={LeafletMarketInterval.NONE}>Highest</option>
				<option value={LeafletMarketInterval.SMALL}>Medium</option>
				<option value={LeafletMarketInterval.MEDIUM}>Low</option>
				<option value={LeafletMarketInterval.LARGE}>Lowest</option>
			</select>

			<br />

			<label>
				<input
					type="checkbox"
					name="subscribe"
					checked={useCache}
					onChange={() => setUseCache(!useCache)}
				/>
				Use cache (Strongly recommended)
			</label>

			<br />
			<button onClick={handleSearch}>Apply filter</button>
			<br />
			{!uid && 'Login required' + '!'.repeat(exclamationCount)}
			{uid &&
				timestampInformation?.length === 0 &&
				isLoaded &&
				'No results found.'}
			{uid &&
				timestampInformation?.length > 0 &&
				isLoaded &&
				`Total ${timestampInformation.length} location snapshots found.`}
			{uid && isLoading && 'Loading...'}
		</>
	);
}

export default LeafletFilter;
