export default class Serializable<T> {
  constructor(public data: T) {
    this.data = data;
  }

  public toJSON(): string {
    return JSON.stringify(this.data);
  }
}
