/**
 * The data class for a snapshot of location. All explanations are from
 * https://developer.android.com/reference/android/location/Location
 *
 */
export default class LocationSnapshot {
	// The record time (upload time) of the location snapshot, in ISO string format or Unix Epoch
	// time format.
	recordTimeISOString: string | null = null;
	recordTimeUnixEpoch: number | null = null;

	// The snapshot time (time of location snapshot taken) of the location snapshot, in ISO string
	// format or Unix Epoch time format.
	snapshotTimeISOString: string | null = null;
	snapshotTimeUnixEpoch: number | null = null;

	// Latitude and Longitude
	latitude: number | null = null;
	longitude: number | null = null;

	// Speed: the speed at the time of this location in meters per second.
	// Note that the speed returned here may be more accurate than would be obtained simply
	// by calculating distance / time for sequential positions, such as if the Doppler
	// measurements from GNSS satellites are taken into account.
	// This is only valid if hasSpeed() is true.
	speed: number | null = null;
	hasSpeed: boolean = false;

	// The altitude of this location in meters above the WGS84 reference ellipsoid.
	// This is only valid if hasAltitude() is true.
	hasAltitude: boolean = false;
	altitude: number | null = null;

	constructor(options: {
		recordTimeISOString?: string | null;
		recordTimeUnixEpoch?: number | null;
		snapshotTimeISOString?: string | null;
		snapshotTimeUnixEpoch?: number | null;
		latitude?: number | null;
		longitude?: number | null;
		speed?: number | null;
		hasSpeed?: boolean;
		hasAltitude?: boolean;
		altitude?: number | null;
	}) {
		this.recordTimeISOString = options.recordTimeISOString ?? null;
		this.recordTimeUnixEpoch = options.recordTimeUnixEpoch ?? null;
		this.snapshotTimeISOString = options.snapshotTimeISOString ?? null;
		this.snapshotTimeUnixEpoch = options.snapshotTimeUnixEpoch ?? null;
		this.latitude = options.latitude ?? null;
		this.longitude = options.longitude ?? null;
		this.speed = options.speed ?? null;
		this.hasSpeed = options.hasSpeed ?? false;
		this.hasAltitude = options.hasAltitude ?? false;
		this.altitude = options.altitude ?? null;
	}
}
