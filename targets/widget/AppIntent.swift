//
//  AppIntent.swift
//  GymBuddy
//
//  Created by Matthew McAuley on 7/14/25.
//

import Foundation
import AppIntents

@available(iOS 18.0, *)
public struct PauseIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Pause timer"
  public func perform() async throws -> some IntentResult {
    if let url = URL(string: "gymbuddy://pause") {
      try await OpenURLIntent(url).perform()
    }
    return .result()
  }
}

@available(iOS 18.0, *)
public struct ResumeIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Resume timer"
  public func perform() async throws -> some IntentResult {
    if let url = URL(string: "gymbuddy://resume") {
      try await OpenURLIntent(url).perform()
    }
    return .result()
  }
}

@available(iOS 18.0, *)
public struct ResetIntent: LiveActivityIntent {
  public init() {}
  public static var title: LocalizedStringResource = "Reset timer"
  public func perform() async throws -> some IntentResult {
    if let url = URL(string: "gymbuddy://reset") {
      try await OpenURLIntent(url).perform()
    }
    return .result()
  }
}
