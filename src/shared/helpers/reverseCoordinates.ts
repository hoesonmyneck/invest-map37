export const reverseCoordinates = (data: any[]): any =>
  Array.isArray(data) ? data.map(reverseCoordinates).reverse() : data;
