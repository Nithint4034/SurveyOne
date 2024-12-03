import React, { useState } from 'react';
import {
    Text,
    ImageBackground,
    StyleSheet,
    TextInput,
    Button,
    View,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Register from './Register';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { setIsLoggedIn } = useLogin();
    const [showComponent, setShowComponent] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'https://nithint.pythonanywhere.com/login',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.data) {
                throw new Error('Failed to authenticate');
            }
            const data = response.data;

            alert('Login successful');
            const keyValuePairs = [
                { key: 'userName', value: data.userName },
                { key: 'email', value: data.email },
            ];
            await Promise.all(
                keyValuePairs.map(async (pair) => {
                    try {
                        await AsyncStorage.setItem(pair.key, pair.value);
                    } catch (error) {
                        console.error(`Error storing ${pair.key}:`, error);
                    }
                })
            );
            setIsLoggedIn(true);
            alert('Login successful!');
        } catch (error) {
            console.error('Login error:', error);
            handleError('An error occurred, please try again later');
        }
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        clearErrorAfterTimeout();
    };

    const clearErrorAfterTimeout = () => {
        setTimeout(() => {
            setError(null);
        }, 4000);
    };

    const handleRegisterPress = () => {
        setShowComponent('register');
    };

    return (
        <ImageBackground
            source={require('../assets/UILand.png')} // Replace with your actual image path
            style={styles.root}
            resizeMode="cover"
        >
            <StatusBar backgroundColor="transparent" />
            {showComponent === 'register' && <Register setShowComponent={setShowComponent} />}
            {!showComponent && (
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    {error && <Text style={styles.error}>{error}</Text>}
                    <Button title="Login" onPress={handleLogin} />
                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={handleRegisterPress}>
                            <Text style={styles.link}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight, 
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1.2,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default Signin;
