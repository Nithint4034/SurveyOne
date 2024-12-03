import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import axios from 'axios';

const Register = ({ setShowComponent }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [contactnumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegisterPress = () => {
        setShowComponent(false);
    };

    const handleRegister = async () => {
        if (password !== confirmpassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(
                'https://nithint.pythonanywhere.com/register',
                {
                    username,
                    email,
                    city,
                    contactnumber,
                    password,
                    confirmpassword,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                alert('Registration successful!');
                setShowComponent(false);
            } else {
                setError('Registration failed');
                clearErrorAfterTimeout();
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
                clearErrorAfterTimeout();
            } else {
                setError('An error occurred. Please try again later.');
                clearErrorAfterTimeout();
            }
        }
    };

    const clearErrorAfterTimeout = () => {
        setTimeout(() => {
            setError(null);
        }, 4000);
    };

    return (
        <ImageBackground
            source={require('../assets/UILand.png')} // Replace with your actual image
            style={styles.root}
            resizeMode="cover"
        >
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="User Name"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contact Number"
                    value={contactnumber}
                    onChangeText={setContactNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {error && <Text style={styles.error}>{error}</Text>}
                <Button title="Register" onPress={handleRegister} />
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={handleRegisterPress}>
                        <Text style={styles.link}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        marginTop: 8,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default Register;
