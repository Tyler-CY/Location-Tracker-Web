import { useState } from 'react';
import LocationSnapshot from '../datamodels/location-snapshot';
import LeafletFilter, { LeafletMarketInterval } from './leaflet-filter';
import UserLoginForm from '../authentication/user-login-form';
import LeafletWrapper from './leaflet-map';
import './leaflet-overview.css';
import LeafletAnalytics from './leaflet-analytics';

function LeafletOverview() {
	const [timestampInformation, setTimestampInformation] = useState<
		LocationSnapshot[]
	>([]);

	const [uid, setUid] = useState('');

	const [markerInterval, setMarkerInterval] = useState<LeafletMarketInterval>(
		LeafletMarketInterval.NONE
	);

	return (
		<>
			{/* 

		

			 */}

			<div style={{ maxHeight: '100%', overflow: 'hidden' }}>
				<div className="leaflet-overview-row">
					<div className="leaflet-overview-column leaflet-overview-column-side">
						<UserLoginForm uid={uid} setUid={setUid}></UserLoginForm>

						<div className="leaflet-overview-separator"></div>

						<div>
							<LeafletFilter
								uid={uid}
								timestampInformation={timestampInformation}
								setTimestampInformation={setTimestampInformation}
								setMarkerInterval={setMarkerInterval}
							></LeafletFilter>
						</div>

						<div className="leaflet-overview-separator"></div>

						<div>
							<LeafletAnalytics timestampInformation={timestampInformation} />
						</div>

						<div className="leaflet-overview-separator"></div>
					</div>
					<div className="leaflet-overview-column leaflet-overview-column-main">
						<LeafletWrapper
							markerInterval={markerInterval}
							timestampInformation={timestampInformation}
						></LeafletWrapper>
					</div>
				</div>
			</div>
		</>
	);
}

export default LeafletOverview;
