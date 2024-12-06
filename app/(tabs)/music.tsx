import {View, Text} from "react-native";
import Login from "@/components/Music/Login";
import {useMusicStore} from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";
import * as AuthSession from "expo-auth-session";

export default function Music() {
    const {loggedIn, setLoggedIn, accessToken, setAccessToken} = useMusicStore();

    const refreshToken = async (refresh_token: string) => {
        let access_token = null;
        let expiration = null;
        let new_refresh_token = null;
        const discovery = {
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
        }
        const config : AuthSession.RefreshTokenRequestConfig = {
            refreshToken: refresh_token,
            clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
            clientSecret: process.env.EXPO_PUBLIC_CLIENT_SECRET!,
        }
        const response = await AuthSession.refreshAsync(config, discovery);
        return {access_token: response.accessToken, expiration: Date.now() + response.expiresIn! * 1000, new_refresh_token: response.refreshToken};
    }

    const retrieveToken = async () => {
        try {
            const expiration = await AsyncStorage.getItem('expiration');
            if (expiration === null) return;
            if (parseInt(expiration) < Date.now()) {
                const refresh_token = await AsyncStorage.getItem('refresh_token');
                const {access_token, expiration, new_refresh_token} = await refreshToken(refresh_token!);
                setAccessToken(access_token);
                await AsyncStorage.setItem('access_token', access_token);
                await AsyncStorage.setItem('expiration', expiration.toString());
                await AsyncStorage.setItem('refresh_token', new_refresh_token!);
                setLoggedIn(true);
                return;
            }
            const access_token = await AsyncStorage.getItem('access_token');
            if (access_token !== null) {
                setLoggedIn(true);
                setAccessToken(access_token);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // AsyncStorage.removeItem('access_token');
        retrieveToken();
    }, []);

    return (!loggedIn) ? (
        <Login />
    ) :
    (
        <View>
            <Text>Music</Text>
        </View>
    );
}