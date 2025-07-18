import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

const nativeModule = requireNativeModule('ActivityController');

export const startLiveActivity: types.startLiveActivityFn = async (time) => {
  return nativeModule.startLiveActivity(time);
}

export const stopLiveActivity: types.stopLiveActivityFn = async () => {
  return nativeModule.stopLiveActivity();
}

export const pause: types.pauseFn = async (time) => {
  return nativeModule.pause(time);
}

export const resume: types.resumeFn = async () => {
  return nativeModule.resume();
}