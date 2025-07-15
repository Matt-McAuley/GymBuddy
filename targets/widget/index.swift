import WidgetKit
import SwiftUI

@available(iOSApplicationExtension 17.0, *)
@main
struct exportWidgets: WidgetBundle {
    var body: some Widget {
        TimerWidgetLiveActivity()
    }
}
