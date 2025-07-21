import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

export const startLiveActivity : types.startLiveActivityFn = async (timestamp) => {
    return;
}

export const stopLiveActivity : types.stopLiveActivityFn = async () => {
    return;
}

export const pause : types.pauseFn = async (timestamp) => {
    return;
}

export const resume : types.resumeFn = async () => {
    return;
}

export const createSubscription : types.createSubscriptionFn = async (eventName, callback) => {
    return;
}