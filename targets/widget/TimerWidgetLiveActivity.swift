//
//  TimerWidgetLiveActivity.swift
//  TimerWidget
//
//  Created by Matthew McAuley on 7/14/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

@available(iOSApplicationExtension 18.0, *)
struct TimerWidgetLiveActivity: Widget {
  func rgb(_ red: Double, _ green: Double, _ blue: Double) -> Color {
    return Color(red: red/255.0, green: green/255.0, blue: blue/255.0)
  }
  
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerWidgetAttributes.self) { context in
      // Lock Screen Widget
      ZStack {
        RoundedRectangle(cornerRadius: 24)
          .fill(Color.black)
          .border(.black, width: 10)
        
        HStack {
          HStack(spacing: 8.0, content: {
            if (context.state.isRunning()) {
              Button(intent: PauseIntent()) {
                ZStack {
                  Circle()
                    .fill(Color.white.opacity(0.2))
                    .frame(width: 53, height: 53)
                  Image(systemName: "pause.fill")
                    .imageScale(.large)
                    .foregroundColor(.white)
                }
              }
              .buttonStyle(PlainButtonStyle())
              .contentShape(Rectangle())
              .padding(.horizontal, 5)
            } else {
              Button(intent: ResumeIntent()) {
                ZStack {
                  Circle()
                    .fill(Color.white.opacity(0.2))
                    .frame(width: 53, height: 53)
                  Image(systemName: "play.fill")
                    .imageScale(.large)
                    .foregroundColor(.white)
                }
              }
              .buttonStyle(PlainButtonStyle())
              .contentShape(Rectangle())
              .padding(.horizontal, 5)
            }
            Button(intent: ResetIntent()) {
              ZStack {
                Circle()
                  .fill(Color.white.opacity(0.2))
                  .frame(width: 53, height: 53)
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
            .font(.system(size:36))
            .foregroundColor(.white)
            .fontWeight(.medium)
            .monospacedDigit()
            .frame(width: 85)
            .transition(.identity)
          } else {
            let date = Date()
            Text(
              timerInterval: date...date.addingTimeInterval(context.state.getTimeIntervalSinceNow()),
              countsDown: true
            )
            .font(.system(size:36))
            .foregroundColor(.white)
            .fontWeight(.medium)
            .monospacedDigit()
            .frame(width: 85)
            .transition(.identity)
          }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 20)
      }
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.center) {
          ZStack {
            RoundedRectangle(cornerRadius: 24)
              .fill(Color.black)
        
            HStack {
              HStack(spacing: 8.0, content: {
                if (context.state.isRunning()) {
                  Button(intent: PauseIntent()) {
                    ZStack {
                      Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 50, height: 50)
                      Image(systemName: "pause.fill")
                        .imageScale(.large)
                        .foregroundColor(.white)
                    }
                  }
                  .buttonStyle(PlainButtonStyle())
                  .contentShape(Rectangle())
                } else {
                  Button(intent: ResumeIntent()) {
                    ZStack {
                      Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 50, height: 50)
                      Image(systemName: "play.fill")
                        .imageScale(.large)
                        .foregroundColor(.white)
                    }
                  }
                  .buttonStyle(PlainButtonStyle())
                  .contentShape(Rectangle())
                }
                Button(intent: ResetIntent()) {
                  ZStack {
                    Circle()
                      .fill(Color.white.opacity(0.2))
                      .frame(width: 50, height: 50)
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
                .font(.system(size:40))
                .foregroundColor(.white)
                .fontWeight(.medium)
                .monospacedDigit()
                .frame(width: 85)
                .transition(.identity)
              } else {
                let date = Date()
                Text(
                  timerInterval: date...date.addingTimeInterval(context.state.getTimeIntervalSinceNow()),
                  countsDown: true
                )
                .font(.system(size:40))
                .foregroundColor(.white)
                .fontWeight(.medium)
                .monospacedDigit()
                .frame(width: 85)
                .transition(.identity)
              }
            }
          }
          .padding(.horizontal, 10)
        }
      } compactLeading: {
        Image(systemName: "timer")
          .imageScale(.medium)
          .foregroundColor(.white)
      } compactTrailing: {
        if (!context.state.isRunning()) {
          Text(context.state.getPausedTime())
            .foregroundColor(.white)
            .monospacedDigit()
        } else {
          let date = Date()
          Text(
            timerInterval: date...date.addingTimeInterval(context.state.getTimeIntervalSinceNow()),
            countsDown: true
          )
          .foregroundColor(.white)
          .monospacedDigit()
          .frame(maxWidth: 32)
        }
      } minimal: {
        Image(systemName: "timer")
          .imageScale(.medium)
          .foregroundColor(.white)
      }
      .widgetURL(URL(string: "http://www.apple.com"))
      .keylineTint(Color.white)
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
    TimerWidgetAttributes.ContentState(startedAt: Date(), startTime: 10)
  }
}

@available(iOS 18.0, *)
#Preview("Notification", as: .content, using: TimerWidgetAttributes.preview) {
  TimerWidgetLiveActivity()
} contentStates: {
  TimerWidgetAttributes.ContentState.initState
}
