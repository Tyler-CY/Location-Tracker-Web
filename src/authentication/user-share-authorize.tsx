import { useState } from 'react';
import { getSharePermission } from '../firebase/firebaseFirestore';

function UserShareAuthorize() {
	const [lookupEmail, setLookupEmail] = useState<string>('');
	const [lookupAuthorized, setLookupAuthorized] = useState<boolean | null>(
		null
	);

	const handleSearchAuthorize = async (e: any) => {
		e.preventDefault();

		const querySnapshot = await getSharePermission('', lookupEmail);
		if (querySnapshot) {
			console.log(querySnapshot.data());
			setLookupAuthorized(true);
		} else {
			setLookupAuthorized(false);
		}
	};

	const handleSearchClear = async (e: any) => {
		e.preventDefault();
		setLookupAuthorized(null);
	};

	return (
		<>
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
		</>
	);
}

export default UserShareAuthorize;
