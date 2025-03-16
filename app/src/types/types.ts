export type location = { coordinates: google.maps.LatLngLiteral };
export type device = { id: number, status: string, golferUUID?: string, name: string, location?: location };
export type golfer = { uuid: string, name: string, pictureUrl: string };
export type selectedGolfer = { uuid: string, name: string };