export interface DataSource<T> {
  readonly name: string;
  readonly type: string;

  fetch(): Promise<T>;
}