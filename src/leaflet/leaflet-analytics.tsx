import {
	CartesianGrid,
	Label,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import LocationSnapshot from '../datamodels/location-snapshot';

export interface LeafletFilterProps {
	timestampInformation: LocationSnapshot[];
}

// Custom tick component
const CustomTick = (props: {
	x: string | number | undefined;
	y: string | number | undefined;
	payload: { value: string };
}) => {
	return (
		<text
			x={props.x}
			y={props.y}
			textAnchor="end"
			dominantBaseline="middle"
			transform={`rotate(-90, ${props.x}, ${props.y})`}
		>
			{props.payload.value.split(' ')[1].split('.')[0] ?? props.payload.value}
		</text>
	);
};

const CustomTooltip = (props?: any) => {
	if (props?.active && props?.payload && props?.payload.length) {
		return (
			<>
				<div
					style={{
						backgroundColor: '#fff',
						border: '1px solid #ccc',
						padding: '10px',
						position: 'absolute',
						top: -80,
						left: 50,
						pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
						overflow: 'hidden', // Hide overflow
						whiteSpace: 'nowrap', // Prevent wrapping
					}}
				>
					{`Time: ${
						props.payload[0].payload.snapshotTimeISOString
							.split(' ')[1]
							.split('.')[0] ?? 'undefined'
					}`}
					<br />
					{`Speed: ${
						Math.round(props.payload[0].payload.speed * 100) / 100
					} m/s`}
				</div>
			</>
		);
	}
	return null;
};

function LeafletAnalytics(props: LeafletFilterProps) {
	return (
		<>
			<div>
				<label>Analytics</label>
				<br />
				<br />
				<label>Speed</label>
				<ResponsiveContainer width="90%" aspect={2}>
					<LineChart
						data={props.timestampInformation}
						margin={{ top: 10, right: 20, left: 10, bottom: 50 }}
					>
						<Line
							type="monotone"
							dataKey="speed"
							stroke="#8884d8"
							dot={false}
						/>
						<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
						<XAxis
							dataKey="snapshotTimeISOString"
							tick={CustomTick}
							interval={50}
						>
							<Label value="Time" offset={-45} position="insideBottom" />
						</XAxis>
						<YAxis>
							<Label value="Speed (m/s)" angle={-90} position="insideLeft" />
						</YAxis>
						<Tooltip content={<CustomTooltip />} />
					</LineChart>
				</ResponsiveContainer>
				<br />
				<label>Altitude</label>
				<ResponsiveContainer width="90%" aspect={2}>
					<LineChart
						data={props.timestampInformation}
						margin={{ top: 10, right: 20, left: 20, bottom: 50 }}
					>
						<Line
							type="monotone"
							dataKey="altitude"
							stroke="#8884d8"
							dot={false}
						/>
						<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
						<XAxis
							dataKey="snapshotTimeISOString"
							tick={CustomTick}
							interval={50}
						>
							<Label value="Time" offset={-45} position="insideBottom" />
						</XAxis>
						<YAxis>
							<Label value="Altitude (m)" angle={-90} position="insideLeft" />
						</YAxis>
						<Tooltip content={<CustomTooltip />} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</>
	);
}

export default LeafletAnalytics;
