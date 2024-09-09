import { useState } from 'react'
import './App.css'
import { UserCredential } from 'firebase/auth'
import LeafletWrapper, { TimestampInformation } from './leaflet/leaflet'
import { firebaseSignIn, firebaseSignUp } from './firebase/firebaseAuth'
import { getSharePermission, getTimestampByDate, getTimestampByDateOld } from './firebase/firebaseFirestore'

function App() {
  // const [count, setCount] = useState(0)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [lookupDate, setLookupDate] = useState<string>('');
  const [lookupEmail, setLookupEmail] = useState<string>('');
  const [lookupAuthorized, setLookupAuthorized] = useState<boolean | null>(null);
  const [timestampInformation, setTimestampInformation] = useState<TimestampInformation[]>([]);

  const [useOld, setUseOld] = useState<boolean | null>(null);
  
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const userCredential: UserCredential | null = await firebaseSignIn(email, password);
    setUid(userCredential?.user?.uid ?? "");
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    const userCredential: UserCredential | null = await firebaseSignUp(email, password);
    setUid(userCredential?.user?.uid ?? "");
  };

  const handleSearch = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    const querySnapshot = useOld ? await getTimestampByDateOld(uid, lookupDate) : await getTimestampByDate(uid, lookupDate);
    const timestampInformation: TimestampInformation[] = [];
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        timestampInformation.push(
          new TimestampInformation(data.latitude, data.longitude, data.locationTimeISOString)
        );
      });
      setTimestampInformation(timestampInformation);
      setIsLoading(false);
    };
    }

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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
        <button onClick={handleSignUp}>Register</button>
      </form>


      <input
        type="email"
        onChange={(e) => setLookupEmail(e.target.value)}
        value={lookupEmail}
        placeholder="Search user by email"
      />
      <button onClick={handleSearchAuthorize}>Authorize</button>
      <button onClick={handleSearchClear}>Clear</button>
      {lookupAuthorized && 'Authorized'}
      {!lookupAuthorized && lookupAuthorized != null && 'Permission deined'}

      <br/>

      <label>
        <input
          type="checkbox"
          checked={useOld ?? false}
          onChange={() => {setUseOld(useOld == null ? true : !useOld)}}
        />
        Check history on or before 2024-09-01
      </label>

      <input type="date" onChange={(event) => {
        console.log(event.currentTarget.value)
        setLookupDate(event.currentTarget.value)
      }}></input>
      <button onClick={handleSearch}>Search</button>

      {isLoading && 'Loading...'}
      


        <LeafletWrapper timestampInformation={timestampInformation}></LeafletWrapper>
      
    </>
  )
}

export default App
