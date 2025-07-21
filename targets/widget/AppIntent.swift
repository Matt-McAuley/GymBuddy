//
//  AppIntent.swift
//  GymBuddy
//
//  Created by Matthew McAuley on 7/14/25.
//

import Foundation
import AppIntents

@available(iOS 18.0, *)
struct PauseIntent: AppIntent, LiveActivityIntent {
    static var title: LocalizedStringResource = "Pause Timer"
    static var description: IntentDescription = "Pauses the current timer."
    
    init() {}
    
    func perform() async throws -> some IntentResult {
        NSLog("Sending Notification!!!!")
        let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
        userDefaults?.set("pause", forKey: "timerAction")
        userDefaults?.synchronize()
        
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName("com.gymbuddy.timer.action" as CFString),
            nil,
            nil,
            true
        )
            return .result()
    }
}

@available(iOS 18.0, *)
struct ResumeIntent: AppIntent, LiveActivityIntent {
    static var title: LocalizedStringResource = "Resume Timer"
    static var description: IntentDescription = "Resumes the current timer."
    
    init() {}
    
    func perform() async throws -> some IntentResult {
        NSLog("Sending Notification!!!!")
        let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
        userDefaults?.set("resume", forKey: "timerAction")
        userDefaults?.synchronize()
        
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName("com.gymbuddy.timer.action" as CFString),
            nil,
            nil,
            true
        )
        return .result()
    }
}

@available(iOS 18.0, *)
struct ResetIntent: AppIntent, LiveActivityIntent {
    static var title: LocalizedStringResource = "Reset Timer"
    static var description: IntentDescription = "Resets the current timer."
    
    init() {}
    
    func perform() async throws -> some IntentResult {
        NSLog("Sending Notification!!!!")
        let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
        userDefaults?.set("reset", forKey: "timerAction")
        userDefaults?.synchronize()
        
        CFNotificationCenterPostNotification(
            CFNotificationCenterGetDarwinNotifyCenter(),
            CFNotificationName("com.gymbuddy.timer.action" as CFString),
            nil,
            nil,
            true
        )
        return .result()
    }
}
