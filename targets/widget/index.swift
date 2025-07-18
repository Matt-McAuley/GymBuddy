import WidgetKit
import SwiftUI

@available(iOSApplicationExtension 18.0, *)
@main
struct exportWidgets: WidgetBundle {
    var body: some Widget {
        TimerWidgetLiveActivity()
    }
}
