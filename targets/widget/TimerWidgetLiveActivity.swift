//
//  TimerWidgetLiveActivity.swift
//  TimerWidget
//
//  Created by Matthew McAuley on 7/14/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

@available(iOSApplicationExtension 17.0, *)
struct TimerWidgetLiveActivity: Widget {
  func rgb(_ red: Double, _ green: Double, _ blue: Double) -> Color {
    return Color(red: red/255.0, green: green/255.0, blue: blue/255.0)
  }
  
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerWidgetAttributes.self) { context in
      VStack {
        Text(
          Date(
            timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()
          ),
          style: .timer
        )
        .font(.title)
        .fontWeight(.medium)
      }
      .activityBackgroundTint(Color.cyan)
      .activitySystemActionForegroundColor(Color.black)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.center) {
          ZStack {
            RoundedRectangle(cornerRadius: 24).strokeBorder(Color(red: 148/255.0, green: 163/255.0, blue: 184/255.0), lineWidth: 2)
            HStack {
              HStack(spacing: 8.0, content: {
                if (context.state.isRunning()) {
                  Button(intent: PauseIntent()) {
                    ZStack {
                      Circle().fill(Color.cyan.opacity(0.5))
                      Image(systemName: "pause.fill")
                        .imageScale(.large)
                        .foregroundColor(.cyan)
                    }
                  }
                  .buttonStyle(PlainButtonStyle())
                  .contentShape(Rectangle())
                } else {
                  Button(intent: ResumeIntent()) {
                    ZStack {
                      Circle().fill(Color.cyan.opacity(0.5))
                      Image(systemName: "play.fill")
                        .imageScale(.large)
                        .foregroundColor(.cyan)
                    }
                  }
                  .buttonStyle(PlainButtonStyle())
                  .contentShape(Rectangle())
                }
                Button(intent: ResetIntent()) {
                  ZStack {
                    Circle().fill(.gray.opacity(0.5))
                    Image(systemName: "xmark")
                      .imageScale(.medium)
                      .foregroundColor(.white)
                  }
                }
                .buttonStyle(PlainButtonStyle())
                .contentShape(Rectangle())
                Spacer()
              })
              if (!context.state.isRunning()) {
                Text(
                  context.state.getPausedTime()
                )
                .font(.title)
                .foregroundColor(.cyan)
                .fontWeight(.medium)
                .monospacedDigit()
                .transition(.identity)
              } else {
                Text(
                  Date(
                    timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()
                  ),
                  style: .timer
                )
                .font(.title)
                .foregroundColor(.cyan)
                .fontWeight(.medium)
                .monospacedDigit()
                .frame(width: 60)
                .transition(.identity)
              }
            }
            .padding()
          }
          .padding()
        }
      } compactLeading: {
        Image(systemName: "timer")
          .imageScale(.medium)
          .foregroundColor(.cyan)
      } compactTrailing: {
        if (context.state.pausedAt != nil) {
          Text(context.state.getPausedTime())
            .foregroundColor(.cyan)
            .monospacedDigit()
        } else {
          Text(
            Date(
              timeIntervalSinceNow: context.state.getTimeIntervalSinceNow()
            ),
            style: .timer
          )
          .foregroundColor(.cyan)
          .monospacedDigit()
          .frame(maxWidth: 32)
        }
      } minimal: {
        Image(systemName: "timer")
          .imageScale(.medium)
          .foregroundColor(.cyan)
      }
      .widgetURL(URL(string: "http://www.apple.com"))
      .keylineTint(Color.red)
    }
  }
}

extension TimerWidgetAttributes {
  fileprivate static var preview: TimerWidgetAttributes {
    TimerWidgetAttributes()
  }
}

extension TimerWidgetAttributes.ContentState {
  fileprivate static var initState: TimerWidgetAttributes.ContentState {
    TimerWidgetAttributes.ContentState(startedAt: Date())
  }
}

@available(iOS 17.0, *)
#Preview("Notification", as: .content, using: TimerWidgetAttributes.preview) {
  TimerWidgetLiveActivity()
} contentStates: {
  TimerWidgetAttributes.ContentState.initState
}
