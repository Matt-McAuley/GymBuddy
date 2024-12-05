import {Text, TouchableOpacity, View} from "react-native";
import * as AuthSession from 'expo-auth-session';
import {useEffect} from "react";

export default function Login() {
    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
    const config : AuthSession.AuthRequestConfig = {
        responseType: AuthSession.ResponseType.Token,
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
        clientSecret: process.env.EXPO_PUBLIC_CLIENT_SECRET,
        scopes: [
            'user-read-currently-playing',
            'user-read-recently-played',
            'user-read-playback-state',
            'user-top-read',
            'user-modify-playback-state',
            'streaming',
            'user-read-email',
            'user-read-private'
        ],
        usePKCE: false,
        redirectUri: AuthSession.makeRedirectUri({
            scheme: 'myapp',
            path: 'auth',
        }),
    }
    const [request, response, promptAsync] = AuthSession.useAuthRequest(config, discovery);

    useEffect(() => {
        if (response?.type === 'success') {
            const {access_token} = response.params;
            console.log(access_token);
        }
    }, [response]);

    return (
        <View className={'h-full flex justify-center items-center'}>
            <TouchableOpacity className={'flex justify-center items-center border-4'} onPress={() => promptAsync()}>
                <Text className={'text-3xl p-5'}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}