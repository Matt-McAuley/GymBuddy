import { requireNativeModule } from 'expo';
import * as types from './ActivityController.types';

const nativeModule = requireNativeModule('ActivityController');

export const startListening: types.startListeningFn = async () => {
  return nativeModule.startListening();
}

export const startLiveActivity: types.startLiveActivityFn = async (startTime, timestamp) => {
  return nativeModule.startLiveActivity(startTime, timestamp);
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

export const createSubscription: types.createSubscriptionFn = (callbacks: {
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
}) => {
  const pauseSubscription = nativeModule.addListener('onWidgetPause', () => {
    console.log('Widget pause tapped - handle in React');
    callbacks.onPause?.();
  });
  
  const resumeSubscription = nativeModule.addListener('onWidgetResume', () => {
    console.log('Widget resume tapped - handle in React');
    callbacks.onResume?.();
  });
  
  const resetSubscription = nativeModule.addListener('onWidgetReset', () => {
    console.log('Widget reset tapped - handle in React');
    callbacks.onReset?.();
  });

  return { 
    pauseSubscription, 
    resumeSubscription, 
    resetSubscription,
    removeAll: () => {
      pauseSubscription?.remove();
      resumeSubscription?.remove();
      resetSubscription?.remove();
    }
  };
}