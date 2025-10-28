export function parsePoint(point: unknown): [number, number] | void {
  if (typeof point === 'string') {
    const [lng, lat] = point.split(',');
    return [Number(lng), Number(lat)];
  }
}
