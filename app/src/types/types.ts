export type location = { coordinates: google.maps.LatLngLiteral };
export type device = { id: number, status: string, golferUUID?: string, name: string, location?: location };
export type golfer = { id: number, name: string, pictureUrl: string };
export type selectedGolfer = { id: number, name: string };
export type member = { firstName: string, lastName: string, id: string, companyId?: string };