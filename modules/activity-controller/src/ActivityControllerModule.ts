import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

const nativeModule = requireNativeModule('ActivityController');

export const startLiveActivity: types.startLiveActivityFn = async (timestamp) => {
  const timestampInSeconds = timestamp / 1000;
  return nativeModule.startLiveActivity(timestampInSeconds);
}

export const stopLiveActivity: types.stopLiveActivityFn = async () => {
  return nativeModule.stopLiveActivity();
}

export const pause: types.pauseFn = async (timestamp) => {
  const timestampInSeconds = timestamp / 1000;
  return nativeModule.pause(timestampInSeconds);
}

export const resume: types.resumeFn = async () => {
  return nativeModule.resume();
}