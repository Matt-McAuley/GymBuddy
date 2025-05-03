import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: LiveActivityAttributes.self) { context in
      // ─ Lock Screen / Banner UI ─
      HStack {
        VStack(alignment: .leading) {
          Text(context.attributes.exerciseName)
            .font(.headline)

          Text(context.state.remainingTime.formattedTimeString())
            .font(.system(size: 48, weight: .bold))
        }
        Spacer()

        // “X” dismiss & reset
        Link(destination: URL(string: "myapp://timer/stop")!) {
          Image(systemName: "xmark.circle.fill")
            .font(.system(size: 36))
            .foregroundColor(.red)
        }
      }
      .padding()
      .widgetURL(URL(string: "myapp://timer")) // tap anywhere → your app

    } dynamicIsland: { context in
      // ─ Dynamic Island UI ─
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Text(context.attributes.exerciseName)
        }
        DynamicIslandExpandedRegion(.center) {
          Text(context.state.remainingTime.formattedTimeString())
            .font(.title2)
        }
        DynamicIslandExpandedRegion(.trailing) {
          // pause / play
          Link(destination: URL(string: "myapp://timer/toggle")!) {
            Image(systemName: context.state.isPaused
                    ? "play.fill" : "pause.fill")
              .font(.title2)
          }
          // stop
          Link(destination: URL(string: "myapp://timer/stop")!) {
            Image(systemName: "xmark.circle.fill")
              .font(.title2)
          }
        }
      } compactLeading: {
        Image(systemName: context.state.isPaused
                ? "play.fill" : "pause.fill")
      } compactTrailing: {
        Text(context.state.remainingTime.formattedTimeString())
      } minimal: {
        Text("\(context.state.remainingTime)")
      }
    }
  }
}