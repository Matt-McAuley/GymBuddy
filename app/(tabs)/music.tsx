import Login from "@/components/Music/Login";
import {useMusicStore} from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";
import * as AuthSession from "expo-auth-session";
import MusicControl from "@/components/Music/MusicControl";

export default function Music() {
    const {loggedIn, setLoggedIn, setAccessToken} = useMusicStore();

    const refreshToken = async (refresh_token: string) => {
        const discovery = {
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
        }
        const config : AuthSession.RefreshTokenRequestConfig = {
            refreshToken: refresh_token,
            clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
            clientSecret: process.env.EXPO_PUBLIC_CLIENT_SECRET!,
        }
        const response = await AuthSession.refreshAsync(config, discovery);
        return {access_token: response.accessToken, expiration: Date.now() + response.expiresIn! * 1000};
    }

    const retrieveToken = async () => {
        try {
            const expiration = await AsyncStorage.getItem('expiration');
            if (expiration === null) return;
            if (parseInt(expiration) < Date.now()) {
                const refresh_token = await AsyncStorage.getItem('refresh_token');
                const {access_token, expiration} = await refreshToken(refresh_token!);
                setAccessToken(access_token);
                await AsyncStorage.setItem('access_token', access_token);
                await AsyncStorage.setItem('expiration', expiration.toString());
                setLoggedIn(true);
                return;
            }
            const access_token = await AsyncStorage.getItem('access_token');
            setLoggedIn(true);
            setAccessToken(access_token);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // AsyncStorage.removeItem('access_token');
        // AsyncStorage.removeItem('expiration');
        // AsyncStorage.removeItem('refresh_token');
        // AsyncStorage.removeItem('device_id');
        // AsyncStorage.setItem('expiration', (Date.now() - 100000).toString());
        retrieveToken();
    }, []);

    return (!loggedIn) ? (
        <Login />
    ) :
    (
        <MusicControl />
    );
}