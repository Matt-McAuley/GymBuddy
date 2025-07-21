export type startListeningFn = () => Promise<void>;

export type startLiveActivityFn = (startTime: number, timestamp: number) => Promise<void>;

export type stopLiveActivityFn = () => Promise<void>;

export type pauseFn = (timestamp: number) => Promise<void>;

export type resumeFn = () => Promise<void>;

export type createSubscriptionFn = (callbacks: {
    onPause?: () => void;
    onResume?: () => void;
    onReset?: () => void;
}) => {
    pauseSubscription: any;
    resumeSubscription: any;
    resetSubscription: any;
    removeAll: () => void;
}