import {Text, TouchableOpacity, View} from "react-native";
import * as AuthSession from 'expo-auth-session';
import {useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMusicStore } from "@/store";

export default function Login() {
    const {setLoggedIn, setAccessToken} = useMusicStore();

    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
    const config : AuthSession.AuthRequestConfig = {
        responseType: AuthSession.ResponseType.Code,
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
        clientSecret: process.env.EXPO_PUBLIC_CLIENT_SECRET,
        scopes: [
            'user-read-currently-playing',
            'user-read-recently-played',
            'user-read-playback-state',
            'user-modify-playback-state',
            'streaming',
            'user-library-read',
            'user-library-modify',
            'playlist-read-private'
        ],
        usePKCE: false,
        redirectUri: AuthSession.makeRedirectUri({
            scheme: 'myapp',
            path: 'auth',
        }),
    }
    const [_, response, promptAsync] = AuthSession.useAuthRequest(config, discovery);

    const exchangeCode = async (code: string) => {
        const tokenRequestConfig: AuthSession.AccessTokenRequestConfig = {
            code,
            clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
            clientSecret: process.env.EXPO_PUBLIC_CLIENT_SECRET!,
            redirectUri: AuthSession.makeRedirectUri({
                scheme: 'myapp',
                path: 'auth',
            }),
        };
        try {
            const { accessToken, expiresIn, refreshToken } = await AuthSession.exchangeCodeAsync(tokenRequestConfig, discovery);
            await storeToken(accessToken, expiresIn!.toString(), refreshToken!);
        } catch (e) {
            console.log(e);
        }
    }

    const storeToken = async (access_token: string, expires_in: string, refresh_token: string) => {
        try {
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('expiration', (Date.now() + parseInt(expires_in) * 1000).toString());
            await AsyncStorage.setItem('refresh_token', refresh_token);
            setAccessToken(access_token);
            setLoggedIn(true);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            exchangeCode(code);
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