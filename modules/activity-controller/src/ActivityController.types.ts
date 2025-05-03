export type LiveActivityParams = {
  // must match your Swift StartActivityArgs
  exerciseName: string;
};

export type StartLiveActivityFn = (
    params: LiveActivityParams
) => Promise<{ activityId: string }>;

export type UpdateLiveActivityParams = {
  remainingTime: number;
  isPaused: boolean;
};

export type UpdateLiveActivityFn = (
    params: UpdateLiveActivityParams
) => Promise<void>;

export type StopLiveActivityFn = () => Promise<void>;

export type IsLiveActivityRunningFn = () => boolean;
