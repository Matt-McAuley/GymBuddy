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
      let activityID = context.activityID

      // Lock Screen Widget
      ZStack {
        RoundedRectangle(cornerRadius: 24)
          .fill(Color.black)
          .border(.black, width: 10)
        
        VStack() {
          
          HStack() {
            Text(context.attributes.name)
              .font(.system(size: 24, weight: .semibold))
              .foregroundColor(.white)
              .multilineTextAlignment(.leading)
              .padding(.top, 15)
              .padding(.leading, 5)
            
            Spacer()
          }
          
          HStack {
            HStack(spacing: 8.0, content: {
              if (context.state.isRunning()) {
                Button(intent: PauseIntent(activityID)) {
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
                .padding(.trailing, 5)
              } else {
                Button(intent: ResumeIntent(activityID)) {
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
                .padding(.trailing, 5)
              }
              Button(intent: ResetIntent(activityID)) {
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
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 20)
      }
    } dynamicIsland: { context in
      let activityID = context.activityID

      return DynamicIsland {
        DynamicIslandExpandedRegion(.center) {
          ZStack {
            RoundedRectangle(cornerRadius: 24)
              .fill(Color.black)
              .border(.black, width: 10)
            
            VStack() {
              
              HStack() {
                Text(context.attributes.name)
                  .font(.system(size: 24, weight: .semibold))
                  .foregroundColor(.white)
                  .multilineTextAlignment(.leading)
                  .padding(.leading, 5)
                
                Spacer()
              }
              
              HStack {
                HStack(spacing: 8.0, content: {
                  if (context.state.isRunning()) {
                    Button(intent: PauseIntent(activityID)) {
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
                    .padding(.trailing, 5)
                  } else {
                    Button(intent: ResumeIntent(activityID)) {
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
                    .padding(.trailing, 5)
                  }
                  Button(intent: ResetIntent(activityID)) {
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
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
          }
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
    TimerWidgetAttributes(name: "DB Bench")
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
