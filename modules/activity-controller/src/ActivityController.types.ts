import { EventSubscription } from 'expo-modules-core';

export type startListeningFn = () => Promise<void>;

export type startLiveActivityFn = (startTime: number, timestamp: number) => Promise<void>;

export type stopLiveActivityFn = () => Promise<void>;

export type pauseFn = (timestamp: number) => Promise<void>;

export type resumeFn = (timestamp: number) => Promise<void>;

export type addTimerListenerFn = (listener: (event: {action: string; timestamp: number}) => void) => EventSubscription;