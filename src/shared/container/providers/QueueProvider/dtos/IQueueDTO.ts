export interface IQueueDTO<T> {
  [key: string]: {
    queue: T;
    handle: ({ data }: { data: unknown }) => Promise<void>;
  };
}
