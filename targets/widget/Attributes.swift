import ActivityKit
import SwiftUI

public struct LiveActivityAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    // how many seconds remain
    var remainingTime: Int
    // whether the timer is currently paused
    var isPaused: Bool
  }

  // static data you pass in at start
  public let exerciseName: String
}

// helper to format an Int (seconds) as “h:mm:ss” or “m:ss”
extension Int {
  func formattedTimeString() -> String {
    let totalSeconds = self
    let hours = totalSeconds / 3600
    let minutes = (totalSeconds % 3600) / 60
    let seconds = totalSeconds % 60

    if hours > 0 {
      return String(format: "%d:%02d:%02d", hours, minutes, seconds)
    } else {
      return String(format: "%d:%02d", minutes, seconds)
    }
  }
}
