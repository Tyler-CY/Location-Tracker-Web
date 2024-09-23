import { UserCredential } from 'firebase/auth';
import { useState } from 'react';
import { firebaseLogin, firebaseRegister } from '../firebase/firebaseAuth';
import { FirebaseError } from 'firebase/app';

// Define an interface for props
export interface UserLoginFormProps {
	uid: string;
	setUid: React.Dispatch<React.SetStateAction<string>>;
}

function UserLoginForm(props: UserLoginFormProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [userCredential, setUserCredential] = useState<UserCredential | null>(
		null
	);
	const { uid, setUid } = props;

	const handleLogin = async (e: any) => {
		e.preventDefault();

		try {
			const userCredential: UserCredential | null = await firebaseLogin(
				email,
				password
			);
			setError('');
			setUserCredential(userCredential);
			setUid(userCredential?.user?.uid ?? '');
		} catch (e: unknown) {
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		}
	};

	const handleSignUp = async (e: any) => {
		e.preventDefault();

		const userCredential: UserCredential | null = await firebaseRegister(
			email,
			password
		);
		setUid(userCredential?.user?.uid ?? '');
	};

	return (
		<>
			<form onSubmit={handleLogin}>
				<label>Login</label>
				<br />
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<br />
				<input
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<br />
				<button type="submit">Sign In</button>
				<button onClick={handleSignUp} disabled>
					Register
				</button>
				<br />
				{error}
				<br />
				{uid && uid != '' && `Logged in as ${userCredential?.user?.email}`}
			</form>
		</>
	);
}

export default UserLoginForm;
