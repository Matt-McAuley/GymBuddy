import { Stack } from "expo-router";
import Header from "@/components/Header";
import "@/global.css";
import Toast, {SuccessToast, ErrorToast, ToastConfig} from "react-native-toast-message";

const toastConfig = {
    success: (props) => {
        return <SuccessToast
            {...props}
            style={{height: 100, borderLeftColor: 'green'}}
            text1Style={{fontSize: 30}}
            text2Style={{fontSize: 25, color: 'black'}}
            text2NumberOfLines={1}
        />
    },
    error: (props) => {
        return <ErrorToast
            {...props}
            style={{height: 120, borderLeftColor: 'red'}}
            text1Style={{fontSize: 30}}
            text2Style={{fontSize: 25, color: 'black'}}
            text2NumberOfLines={2}
        />
    }
}

export default function RootLayout() {
  return (
      <>
          <Stack>
              <Stack.Screen name="(tabs)" options={{ header: () => <Header /> }} />
          </Stack>
          <Toast config={toastConfig}/>
      </>
  )
}
