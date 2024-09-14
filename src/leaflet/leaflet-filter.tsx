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

	const [lookupDate, setLookupDate] = useState<string>(getTodayDate());

	const [useOld, setUseOld] = useState<boolean | null>(null);

	const [useCache, setUseCache] = useState<boolean>(false);

	const { uid, setTimestampInformation, setMarkerInterval } = props;

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
			<label>Day of Timeline History: </label>
			<input
				type="date"
				value={lookupDate}
				onChange={event => {
					console.log(event.currentTarget.value);
					setLookupDate(event.currentTarget.value);
					setUseOld(
						new Date(event.currentTarget.value) <= new Date('2024-09-01')
							? true
							: !useOld
					);
				}}
			></input>

			<br />

			<label>Marker render interval: </label>
			<select
				name="marker-interval"
				id="market-interval-dropdown"
				onChange={e => {
					setMarkerInterval(e.target.value as LeafletMarketInterval);
				}}
			>
				<option value={LeafletMarketInterval.NONE}>Default (10 seconds)</option>
				<option value={LeafletMarketInterval.SMALL}>Small (1 minute)</option>
				<option value={LeafletMarketInterval.MEDIUM}>Medium (5 minutes)</option>
				<option value={LeafletMarketInterval.LARGE}>Large (10 minutes)</option>
			</select>

			<br />

			<label>
				<input
					type="checkbox"
					name="subscribe"
					checked={useCache}
					onChange={() => setUseCache(!useCache)}
				/>
				Use cache
			</label>

			<br />
			<button onClick={handleSearch}>Apply filter</button>
			{isLoading && 'Loading...'}
		</>
	);
}

export default LeafletFilter;
