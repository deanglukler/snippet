import log from './log';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function logAndThrow(message: string, ...arg: any[]) {
  log(message, ...arg);
  throw message;
}
