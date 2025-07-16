export type startLiveActivityFn = (time: number) => Promise<void>;

export type stopLiveActivityFn = () => Promise<void>;

export type pauseFn = () => Promise<void>;

export type resumeFn = () => Promise<void>;