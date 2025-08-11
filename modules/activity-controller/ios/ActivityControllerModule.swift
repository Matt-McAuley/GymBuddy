//
//  ActivityControllerModule.swift
//  GymBuddy
//
//  Created by Matthew McAuley on 7/14/25.
//

import Foundation
import ActivityKit
import ExpoModulesCore

public class ActivityControllerModule: Module {
  private var currentActivity: Any?
  private var startedAt: Date?
  private var startTime: Int?
  private var pausedAt: Date?
  private var name: String = "NA"
  private var timerMonitor: Timer?
  private var hasCompleted: Bool = false

  public func definition() -> ModuleDefinition {
    Name("ActivityController")

    Events("onTimerAction")
      
    Function("startListening") {
      self.startListening()
    }
    
    Function("startLiveActivity") { (startTime: Int, timestamp: Double, name: String) in
      if #available(iOS 18.0, *) {
        self.startLiveActivity(startTime, timestamp, name)
      }
    }
    
    Function("stopLiveActivity") {
      if #available(iOS 18.0, *) {
        self.stopLiveActivity()
      }
    }
    
    Function("pause") { (timestamp: Double) in
      if #available(iOS 18.0, *) {
        self.pause(timestamp)
      }
    }
    
    Function("resume") { (timestamp: Double) in
      if #available(iOS 18.0, *) {
        self.resume(timestamp)
      }
    }
  }

  private func startListening() {
    CFNotificationCenterAddObserver(
      CFNotificationCenterGetDarwinNotifyCenter(),
      Unmanaged.passUnretained(self).toOpaque(),
      { (center, observer, name, object, userInfo) in
        guard let observer = observer else { return }
        let moduleInstance = Unmanaged<ActivityControllerModule>.fromOpaque(observer).takeUnretainedValue()
        moduleInstance.handleTimerAction()
      },
      "com.gymbuddy.timer.action" as CFString,
      nil,
      .deliverImmediately
    )
  }
  
  private func handleTimerAction() {
    let userDefaults = UserDefaults(suiteName: "group.com.mattmcauley.GymBuddy.share")
    if let action = userDefaults?.object(forKey: "timerAction") as? String {
      if let timestamp = userDefaults?.object(forKey: "timestamp") as? Double {
        if action == "pause" {
          sendEvent("onTimerAction", ["action": "pause", "timestamp": timestamp * 1000])
          if #available(iOS 18.0, *) {
            self.pause(timestamp)
          }
        } else if action == "resume" {
          sendEvent("onTimerAction", ["action": "resume", "timestamp": timestamp * 1000])
          if #available(iOS 18.0, *) {
            self.resume(timestamp)
          }
        } else if action == "reset" {
          sendEvent("onTimerAction", ["action": "reset", "timestamp": timestamp * 1000])
          if #available(iOS 18.0, *) {
            self.resetValues()
            self.stopLiveActivity()
          }
        }
      }
    }
  }

  private func areActivitiesEnabled() -> Bool {
    if #available(iOS 18.0, *) {
      return ActivityAuthorizationInfo().areActivitiesEnabled
    }
    return false
  }
  
  private func resetValues() {
    startedAt = nil
    startTime = nil
    pausedAt = nil
    currentActivity = nil
    hasCompleted = false
    stopTimerMonitoring()
  }

  func scheduleNotification() {
    let content = UNMutableNotificationContent()
    content.title = "GymBuddy"
    content.body = "Timer finished"
    content.sound = UNNotificationSound.default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.01, repeats: false)

    let request = UNNotificationRequest(identifier: "reminderNotification", content: content, trigger: trigger)

    UNUserNotificationCenter.current().add(request) { error in
        if let error = error {
            NSLog("Error scheduling notification: %@", error.localizedDescription);
        } else {}
    }
  }

  private func startTimerMonitoring() {
    stopTimerMonitoring()
    hasCompleted = false
    
    timerMonitor = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
      self?.checkTimerCompletion()
    }
  }
  
  private func stopTimerMonitoring() {
    timerMonitor?.invalidate()
    timerMonitor = nil
  }
  
  private func checkTimerCompletion() {
    guard let startedAt = self.startedAt,
          let startTime = self.startTime,
          !hasCompleted else { return }
    
    let currentTime = Date()
    var elapsedSeconds: Double
    
    if let pausedAt = self.pausedAt {
      elapsedSeconds = pausedAt.timeIntervalSince1970 - startedAt.timeIntervalSince1970
    } else {
      elapsedSeconds = currentTime.timeIntervalSince1970 - startedAt.timeIntervalSince1970
    }
    
    let remainingTime = Double(startTime) - elapsedSeconds
    
    if remainingTime <= 0 && !hasCompleted && pausedAt == nil {
      hasCompleted = true
      scheduleNotification()
      self.stopLiveActivity()
      sendEvent("onTimerAction", ["action": "reset", "timestamp": 0])
      stopTimerMonitoring()
    }
  }

  private func startLiveActivity(_ startTime: Int,_ timestamp: Double, _ name: String) -> Void {
    guard #available(iOS 18.0, *) else { return }
    
    startedAt = Date(timeIntervalSince1970: timestamp)
    self.name = name
    self.startTime = startTime
    hasCompleted = false

    startTimerMonitoring()

    if (!areActivitiesEnabled()) {
      return
    }
    let activityAttributes = TimerWidgetAttributes(name: name)
    let contentState = TimerWidgetAttributes.ContentState(startedAt: startedAt, startTime: startTime, pausedAt: nil)
    let activityContent = ActivityContent(state: contentState,  staleDate: nil)
    do {
      currentActivity = try Activity.request(attributes: activityAttributes, content: activityContent)
    } catch {}
  }

  private func stopLiveActivity() -> Void {
    guard #available(iOS 18.0, *) else { return }
    
    startedAt = nil
    resetValues()
    Task {
      for activity in Activity<TimerWidgetAttributes>.activities {
        await activity.end(nil, dismissalPolicy: .immediate)
      }
    }
  }
  
  private func pause(_ timestamp: Double) -> Void {
    guard #available(iOS 18.0, *) else { return }
    
    pausedAt = Date(timeIntervalSince1970: timestamp)
    let contentState = TimerWidgetAttributes.ContentState(startedAt: startedAt, startTime: startTime, pausedAt: pausedAt)
    Task {
      if let activity = currentActivity as? Activity<TimerWidgetAttributes> {
        await activity.update(
          ActivityContent<TimerWidgetAttributes.ContentState>(
            state: contentState,
            staleDate: nil
          )
        )
      }
    }
  }
  
  private func resume(_ timestamp: Double) -> Void {
    guard #available(iOS 18.0, *) else { return }
    guard let startDate = self.startedAt else { return }
    guard let pauseDate = self.pausedAt else { return }
    
    let elapsedSincePaused = timestamp - pauseDate.timeIntervalSince1970
    startedAt = Date(timeIntervalSince1970: startDate.timeIntervalSince1970 + elapsedSincePaused)
    pausedAt = nil
    hasCompleted = false
    
    let contentState = TimerWidgetAttributes.ContentState(startedAt: startedAt, startTime: startTime, pausedAt: nil)
    Task {
      if let activity = currentActivity as? Activity<TimerWidgetAttributes> {
        await activity.update(
          ActivityContent<TimerWidgetAttributes.ContentState>(
            state: contentState,
            staleDate: nil
          )
        )
      }
    }
  }
}
