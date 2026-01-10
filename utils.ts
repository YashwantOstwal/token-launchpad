export function truncateAddress(address: string, n: number = 4) {
  return address.slice(0, n) + "..." + address.slice(address.length - n);
}
export function run<T>(fn: () => T): T {
  return fn();
}
