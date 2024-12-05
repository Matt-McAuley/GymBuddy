import {View, Text} from "react-native";
import * as AuthSession from 'expo-auth-session';

export default function Login() {
    async function authenticate() {
        const discovery = {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
        }
        const config : AuthSession.AuthRequestConfig = {
            clientId: 'a6ece74c3c2646ae91ea8cdc34004aaf',
            scopes: [
                'user-read-private',
                'user-read-email',
                'user-library-read',
                'playlist-read-private',
                'user-read-recently-played',
                'user-top-read',
                'playlist-read-collaborative',
                'playlist-modify-public',
            ],
            usePKCE: false,
            redirectUri: AuthSession.makeRedirectUri({
                scheme: 'myapp',
            }),
        }
        const result = AuthSession.useAuthRequest(config, discovery);
        console.log(result);
    }

    return (
        <View className={'flex justify-center items-center h-full'}>
            <Text className={'text-3xl'}>Music</Text>
        </View>
    )
}