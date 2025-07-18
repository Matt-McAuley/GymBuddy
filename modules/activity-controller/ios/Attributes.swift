//
//  Attributes.swift
//  GymBuddy
//
//  Created by Matthew McAuley on 7/14/25.
//

import ActivityKit
import SwiftUI

struct TimerWidgetAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var startedAt: Date?
    var startTime: Int?
    var pausedAt: Date?
    
    func getElapsedTimeInSeconds() -> Int {
      let now = Date()
      guard let startedAt = self.startedAt else {
        return 0
      }
      guard let pausedAt = self.pausedAt else {
        return Int(now.timeIntervalSince1970 - startedAt.timeIntervalSince1970)
      }
      return Int(pausedAt.timeIntervalSince1970 - startedAt.timeIntervalSince1970)
    }
    
    func getPausedTime() -> String {
      let elapsedTimeInSeconds = getElapsedTimeInSeconds()
      let remaining = startTime ?? 0 - elapsedTimeInSeconds
      guard remaining > 0 else {
        return "0:00"
      }
      let minutes = (remaining % 3600) / 60
      let seconds = remaining % 60
      return String(format: "%d:%02d", minutes, seconds)
    }
    
    func getTimeIntervalSinceNow() -> Double {
      guard let startedAt = self.startedAt else {
        return 0
      }
      guard let startTime = self.startTime else {
        return 0
      }
      return Double(startTime) + (startedAt.timeIntervalSince1970 - Date().timeIntervalSince1970)
    }
    
    func isRunning() -> Bool {
      return pausedAt == nil
    }
  }
}
