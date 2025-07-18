import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

const nativeModule = requireNativeModule('ActivityController');

export const startLiveActivity: types.startLiveActivityFn = async (startTime) => {
  return nativeModule.startLiveActivity(startTime);
}

export const stopLiveActivity: types.stopLiveActivityFn = async () => {
  return nativeModule.stopLiveActivity();
}

export const pause: types.pauseFn = async (timestamp) => {
  return nativeModule.pause(timestamp);
}

export const resume: types.resumeFn = async () => {
  return nativeModule.resume();
}