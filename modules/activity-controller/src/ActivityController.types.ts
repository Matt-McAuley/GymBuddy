export type startLiveActivityFn = (startTime: number, timestamp: number) => Promise<void>;

export type stopLiveActivityFn = () => Promise<void>;

export type pauseFn = (timestamp: number) => Promise<void>;

export type resumeFn = () => Promise<void>;