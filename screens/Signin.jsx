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
    Image,
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
            handleError('Please check Email and Password');
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
            source={require('../assets/UILand.png')}
            style={styles.root}
            resizeMode="cover"
        >
            <StatusBar backgroundColor="#4A4947" barStyle="light-content" />
            {showComponent === 'register' && <Register setShowComponent={setShowComponent} />}
            {!showComponent && (
                <View style={styles.container}>
                    {/* Add a container for the icons */}
                    <View style={styles.iconsContainer}>
                        <View style={styles.iconView}>
                            <Image source={require('../assets/Log1.png')} style={styles.icon1} />
                        </View>
                        <View style={styles.iconView}>
                            <Image source={require('../assets/Log2.png')} style={styles.icon2} />
                        </View>
                    </View>

                    <Text style={styles.title}>Application for Unallotted Plot D2D Survey</Text>
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


                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={handleRegisterPress} style={styles.backToRegisterButton}>
                            <Text style={styles.backToRegisterText}>Register</Text>
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
    iconsContainer: {
        flexDirection: 'row', // Align views side by side
        justifyContent: 'space-between', // Distribute space between the icons
        alignItems: 'center', // Align vertically
        marginBottom: 20, // Add spacing between icons and title
        width: '80%', // Limit width to 80% to avoid overflow
    },
    iconView: {
        flex: 1, // Make each icon view take equal width
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon1: {
        width: 90, // Set icon width
        height: 65, // Set icon height
    },
    icon2: {
        width: 65, // Set icon width
        height: 70, // Set icon height
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
    title: {
        marginBottom: 18,
        fontSize: 19,
        fontWeight: 'bold',
        color: '#4A4947',
        textAlign: 'center',
    },
    loginButton: {
        width: '80%',
        padding: 12,
        backgroundColor: '#4A4947',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backToRegisterButton: {
        // marginTop: 5,
        padding: 8,
        alignItems: 'center',
    },
    backToRegisterText: {
        color: '#4A4947',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default Signin;
