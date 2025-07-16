import React, { useState } from 'react';
import {
    Text,
    ImageBackground,
    StyleSheet,
    Image,
    TextInput,
    View,
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Register from './Register';

const Signin = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState(null);
    const { setIsLoggedIn } = useLogin();
    const [showComponent, setShowComponent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            setError('Phone and password are required');
            clearErrorAfterTimeout();
            return;
        }

        if (phone.length !== 10) {
            setError('Phone number must be 10 digits');
            clearErrorAfterTimeout();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'https://tomhudson.pythonanywhere.com/login',
                { phone, password, role },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data) {
                throw new Error('Failed to authenticate');
            }

            const { user, access } = response.data;
            alert('Login successful');

            // Store all authentication data
            await AsyncStorage.multiSet([
                ['phone', phone],
                ['role', role],
                ['accessToken', access],  // Store access token
                // ['refreshToken', refresh],  // Store refresh token
                // ['userId', user.id.toString()],
                ['username', user.username],
                ['isLoggedIn', 'true']  // Additional flag for quick login check
            ]);

            setIsLoggedIn(true);
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please check your credentials.';

            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
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

    const handlePhoneChange = (text) => {
        const cleanedText = text.replace(/[^\d]/g, '');
        if (cleanedText.length <= 10) {
            setPhone(cleanedText);
        }
    };

    return (
        <View style={styles.root}>
            {showComponent === 'register' && <Register setShowComponent={setShowComponent} />}
            {!showComponent && (
                <ImageBackground
                    source={require('../assets/UILand.png')}
                    style={styles.container}
                >
                    {/* Logo Row */}
                    <View style={styles.logoRow}>
                        <View style={styles.logoWithText}>
                            <Image
                                source={require('../assets/icon2.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.logoText}>KMEA</Text>
                        </View>
                        <View style={styles.logoWithText}>
                            <Image
                                source={require('../assets/icon1.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.logoText}>eGeo Tech</Text>
                        </View>
                    </View>

                    {/* Survey Title */}
                    <Text style={styles.surveyTitle}>PMKYS Survey</Text>

                    {/* Form Fields */}
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={role}
                            onValueChange={(itemValue) => setRole(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="User" value="user" />
                            <Picker.Item label="Admin" value="admin" />
                        </Picker>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />

                    {/* Error and Login Button */}
                    <View style={styles.loginSection}>
                        {error && <Text style={styles.error}>{error}</Text>}
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 50, // Added fixed height
        marginBottom: 10,
        padding: 10,
        borderWidth: 1.2,
        borderColor: 'black',
        borderRadius: 8,
        fontWeight: 'bold'
    },
    pickerContainer: {
        width: '80%',
        height: 50,
        marginBottom: 10,
        borderWidth: 1.2,
        borderColor: 'black',
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: 60,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',  // Ensure error text takes full width of its container
    },
    loginSection: {
        width: '80%',  // Match the width of your input fields
        alignItems: 'center',  // Center children horizontally
        marginBottom: 10,  // Add some margin if needed
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 5,
    },
    title: {
        marginBottom: 18,
        fontSize: 19,
        fontWeight: 'bold',
        color: '#4A4947',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    link: {
        color: '#074173',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    loginButton: {
        width: '100%',  // Now takes full width of loginSection (which is 80% of screen)
        padding: 12,
        backgroundColor: '#4A4947',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 0,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
        gap: 40,
    },
    surveyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A4947',
        marginBottom: 20,
        textAlign: 'center',
    },
    logoWithText: {
        alignItems: 'center',
    },

    logoText: {
        marginTop: 8,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4947',
        textAlign: 'center',
    },


});

export default Signin;