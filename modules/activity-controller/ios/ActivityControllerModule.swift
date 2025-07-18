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

  public func definition() -> ModuleDefinition {
    Name("ActivityController")
    
    Function("startLiveActivity") { (startTime: Int, timestamp: Double) in
      if #available(iOS 18.0, *) {
        self.startLiveActivity(startTime, timestamp)
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
    
    Function("resume") {
      if #available(iOS 18.0, *) {
        self.resume()
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
  }

  private func startLiveActivity(_ startTime: Int,_ timestamp: Double) -> Void {
    guard #available(iOS 18.0, *) else { return }
    
    startedAt = Date(timeIntervalSince1970: timestamp)
    if (!areActivitiesEnabled()) {
      return
    }
    let activityAttributes = TimerWidgetAttributes()
    let contentState = TimerWidgetAttributes.ContentState(startedAt: startedAt, startTime: startTime, pausedAt: nil)
    let activityContent = ActivityContent(state: contentState,  staleDate: nil)
    do {
      currentActivity = try Activity.request(attributes: activityAttributes, content: activityContent)
    } catch {}
  }

  private func stopLiveActivity() -> Void {
    guard #available(iOS 18.0, *) else { return }
    
    startedAt = nil
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
  
  private func resume() -> Void {
    guard #available(iOS 18.0, *) else { return }
    guard let startDate = self.startedAt else { return }
    guard let pauseDate = self.pausedAt else { return }
    
    let elapsedSincePaused = Date().timeIntervalSince1970 - pauseDate.timeIntervalSince1970
    startedAt = Date(timeIntervalSince1970: startDate.timeIntervalSince1970 + elapsedSincePaused)
    pausedAt = nil
    
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
