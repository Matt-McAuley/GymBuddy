import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

const nativeModule = requireNativeModule('ActivityController');

export const startListening: types.startListeningFn = async () => {
  return nativeModule.startListening();
}

export const startLiveActivity: types.startLiveActivityFn = async (startTime, timestamp, name) => {
  return nativeModule.startLiveActivity(startTime, timestamp, name);
}

export const stopLiveActivity: types.stopLiveActivityFn = async () => {
  return nativeModule.stopLiveActivity();
}

export const pause: types.pauseFn = async (timestamp) => {
  return nativeModule.pause(timestamp);
}

export const resume: types.resumeFn = async (timestamp) => {
  return nativeModule.resume(timestamp);
}

export const addTimerListener: types.addTimerListenerFn = (listener) => {
  return nativeModule.addListener('onTimerAction', listener);
}