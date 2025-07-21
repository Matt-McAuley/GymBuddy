//
//  AppIntent.swift
//  GymBuddy
//
//  Created by Matthew McAuley on 7/14/25.
//

import Foundation
import AppIntents
import ActivityKit

@available(iOS 18.0, *)
struct PauseIntent: AppIntent, LiveActivityIntent {
    static var title: LocalizedStringResource = "Pause Timer"
    static var description: IntentDescription = "Pauses the current timer."

    @Parameter(title: "activityID")
    var activityID: String
    
    init() {}

    init (_ activityID: String) {
        self.activityID = activityID
    }
    
    func perform() async throws -> some IntentResult {
        let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
        let timestamp = Date().timeIntervalSince1970
        userDefaults?.set("pause", forKey: "timerAction")
        userDefaults?.set(timestamp, forKey: "timestamp")
        userDefaults?.synchronize()
        
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName("com.gymbuddy.timer.action" as CFString),
            nil,
            nil,
            true
        )

        await updateLiveActivityForPause(timestamp: timestamp)
        
        return .result()
    }

    private func updateLiveActivityForPause(timestamp: Double) async {
        let activities = Activity<TimerWidgetAttributes>.activities
        let activity = activities.first { $0.id == activityID }

        guard let activity = activity else {
            return
        }

        let currentState = activity.content.state
        let pausedAt = Date(timeIntervalSince1970: timestamp)
        
        let newContentState = TimerWidgetAttributes.ContentState(
            startedAt: currentState.startedAt,
            startTime: currentState.startTime,
            pausedAt: pausedAt
        )
        
        await activity.update(
            ActivityContent<TimerWidgetAttributes.ContentState>(
                state: newContentState,
                staleDate: nil
            )
        )
    }
}

@available(iOS 18.0, *)
struct ResumeIntent: AppIntent, LiveActivityIntent {
    static var title: LocalizedStringResource = "Resume Timer"
    static var description: IntentDescription = "Resumes the current timer."
    
    @Parameter(title: "activityID")
    var activityID: String
    
    init() {}

    init (_ activityID: String) {
        self.activityID = activityID
    }
    
    func perform() async throws -> some IntentResult {
        let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
        userDefaults?.set("resume", forKey: "timerAction")
        userDefaults?.set(Date().timeIntervalSince1970, forKey: "timestamp")
        userDefaults?.synchronize()
        
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName("com.gymbuddy.timer.action" as CFString),
            nil,
            nil,
            true
        )

        await updateLiveActivityForResume(timestamp: Date().timeIntervalSince1970)

        return .result()
    }

    private func updateLiveActivityForResume(timestamp: Double) async {
        let activities = Activity<TimerWidgetAttributes>.activities
        let activity = activities.first { $0.id == activityID }

        guard let activity = activity else {
            return
        }
            
        let currentState = activity.content.state
        
        guard let startDate = currentState.startedAt,
                let pauseDate = currentState.pausedAt else { return }
        
        let elapsedSincePaused = timestamp - pauseDate.timeIntervalSince1970
        let newStartedAt = Date(timeIntervalSince1970: startDate.timeIntervalSince1970 + elapsedSincePaused)
        
        let newContentState = TimerWidgetAttributes.ContentState(
            startedAt: newStartedAt,
            startTime: currentState.startTime,
            pausedAt: nil
        )
        
        await activity.update(
            ActivityContent<TimerWidgetAttributes.ContentState>(
                state: newContentState,
                staleDate: nil
            )
        )
    }
}

@available(iOS 18.0, *)
struct ResetIntent: AppIntent, LiveActivityIntent {
    static var title: LocalizedStringResource = "Reset Timer"
    static var description: IntentDescription = "Resets the current timer."
    
    @Parameter(title: "activityID")
    var activityID: String
    
    init() {}

    init (_ activityID: String) {
        self.activityID = activityID
    }
    
    func perform() async throws -> some IntentResult {
        NSLog("Sending Notification!!!!")
        let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
        userDefaults?.set("reset", forKey: "timerAction")
        userDefaults?.set(Date().timeIntervalSince1970, forKey: "timestamp")
        userDefaults?.synchronize()
        
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName("com.gymbuddy.timer.action" as CFString),
            nil,
            nil,
            true
        )

        let activities = Activity<TimerWidgetAttributes>.activities
        let activity = activities.first { $0.id == activityID }

        guard let activity = activity else {
            return
        }

        await activity.end(nil, dismissalPolicy: .immediate)

        return .result()
    }
}
