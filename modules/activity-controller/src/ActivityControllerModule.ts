import { requireNativeModule } from "expo";
import * as types from "./ActivityController.types";

const nativeModule = requireNativeModule("ActivityController");

export const startLiveActivity: types.StartLiveActivityFn = async params => {
  return nativeModule.startLiveActivity(JSON.stringify(params));
};

export const updateLiveActivity: types.UpdateLiveActivityFn = async params => {
  return nativeModule.updateLiveActivity(JSON.stringify(params));
};

export const stopLiveActivity: types.StopLiveActivityFn = async () => {
  return nativeModule.stopLiveActivity();
};

export const isLiveActivityRunning: types.IsLiveActivityRunningFn = () => {
  return nativeModule.isLiveActivityRunning();
};

export const areLiveActivitiesEnabled: boolean =
    nativeModule.areLiveActivitiesEnabled;
