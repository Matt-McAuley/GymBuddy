import {Text, TouchableOpacity, View} from "react-native";
import * as AuthSession from 'expo-auth-session';
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMusicStore } from "@/store";

export default function Login() {
    const {setLoggedIn, setAccessToken} = useMusicStore();

    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
    const config : AuthSession.AuthRequestConfig = {
        responseType: AuthSession.ResponseType.Token,
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
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
    const [_, response, promptAsync] = AuthSession.useAuthRequest(config, discovery);

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
            const {access_token, expires_in, refresh_token} = response.params;
            storeToken(access_token, expires_in, refresh_token);
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