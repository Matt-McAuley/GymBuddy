import ActivityKit
import SwiftUI

public struct LiveActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable & Hashable {
    var startedAt: Date
    var pausedAt: Date?

    func getElapsedTimeInSeconds() -> TimeInterval {
        if let pausedAt = pausedAt {
          return pausedAt.timeIntervalSince(startedAt)
        } else {
          return Date().timeIntervalSince(startedAt)
        }
      }

    func isRunning() -> Bool {
        return pausedAt == nil
      }

    func getFormattedElapsedTime() -> String {
        let elapsed = getElapsedTimeInSeconds()
        let totalSeconds = Int(elapsed)
        let hours = totalSeconds / 3600
        let minutes = (totalSeconds % 3600) / 60
        let seconds = totalSeconds % 60
        if hours > 0 {
          return String(format: "%d:%02d:%02d", hours, minutes, seconds)
        } else {
          return String(format: "%d:%02d", minutes, seconds)
        }
      }

    func getYearFromNow() -> Date {
        return Date().addingTimeInterval(365 * 24 * 60 * 60)
      }
  }
  public let exerciseName: String
}
