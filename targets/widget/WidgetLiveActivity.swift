import ActivityKit
import WidgetKit
import SwiftUI

struct WidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
      ActivityConfiguration(for: LiveActivityAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
              Text(context.attributes.exerciseName)
            }
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom")
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T")
            } minimal: {
                Text("M")
            }
        }
    }
}

#Preview(
    as: .content,
    using: LiveActivityAttributes(exerciseName: "Bench Press"),
    widget: {
        WidgetLiveActivity()
    },
    contentStates: {
        LiveActivityAttributes.ContentState(
            startedAt: Date(),
            pausedAt: nil
        )
    }
)
