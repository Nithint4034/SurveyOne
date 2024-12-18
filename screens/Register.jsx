import React, { useState } from 'react';
import {
    View,
    Text,

    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Image,
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

            console.log('res',response);
            

            if (response.status === 201) {
                alert('Registration successful!');
                setShowComponent(false);
            } else {
                setError('Registration failed');
                clearErrorAfterTimeout();
            }
        } catch (error) {
            console.log('res',error);
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
                clearErrorAfterTimeout();
            } else {
                setError('Username or Email already exists');
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
            <StatusBar backgroundColor="#4A4947" barStyle="light-content" />
            <View style={styles.container}>
                {/* Icons Container */}
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
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={handleRegisterPress} style={styles.backToLoginButton}>
                        <Text style={styles.backToLoginText}>Back to Login</Text>
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
    iconsContainer: {
        flexDirection: 'row', // Align icons side by side
        justifyContent: 'space-between', // Space between icons
        alignItems: 'center', // Vertically align icons
        marginBottom: 20, // Space between icons and the form
        width: '80%', // Limit width of the icon container
    },
    iconView: {
        flex: 1, // Equal space for both icons
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
        marginTop: 8,
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
    registerButton: {
        width: '80%',
        padding: 12,
        backgroundColor: '#4A4947',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backToLoginButton: {
        // marginTop: 5,
        padding: 8,
        alignItems: 'center',
    },
    backToLoginText: {
        color: '#4A4947',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default Register;
