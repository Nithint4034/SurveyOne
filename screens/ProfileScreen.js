import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    Text,
    Button,
} from "react-native";
import { useLogin } from "../context/LoginProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
    const { setIsLoggedIn } = useLogin();
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");

    const handleLogout = async () => {
        // Remove data from AsyncStorage
        try {
            await AsyncStorage.multiRemove([
                "email",
                "userName",
            ]); // Remove all keys you want to clear
            alert("Logout successful!");
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Error removing data from AsyncStorage:", error);
            // Handle error if needed
        }
    };

    useEffect(() => {
        const retrieveData = async () => {
            try {
                // Define the keys you want to retrieve
                const keys = ["email", "userName"]; // Add more keys as needed

                // Retrieve the values for the keys
                const retrievedData = await AsyncStorage.multiGet(keys);

                // Process the retrieved data
                retrievedData.forEach(([key, value]) => {
                    // Set the state or perform any other actions based on the key-value pairs
                    switch (key) {
                        case "email":
                            setEmail(value);
                            break;
                        case "userName":
                            setUserName(value);
                            break;
                        // Add cases for additional keys if needed
                        default:
                            break;
                    }
                });
            } catch (error) {
                console.error("AsyncStorage Error:", error);
            }
        };
        retrieveData();
    }, []);

    return (
        <View>
            <View
                style={{
                    marginTop: 100,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center"
                }}
            >
                <View style={{ marginTop: 15, alignItems: "center" }}>
                    <Text style={{ fontSize: 35, fontWeight: "bold" }}>{userName}</Text>
                    <Text style={{ fontSize: 18, fontWeight:'bold' }}>
                        Email Id : <Text style={{ fontWeight: "400" }}>{email}</Text>
                    </Text>
                </View>
                <View style={{ width: 150, marginLeft: 1, marginTop: 20 }}>
                    <Button title="Logout"
                        onPress={handleLogout}
                        color="#C40C0C" />
                </View>
                <Image source={require("../assets/logOut.png")} style={styles.image} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    image: {
        marginTop: 70,
        width: 250,
        height: 230,
        alignSelf: "center",
        justifyContent: "center",
    },
});

export default ProfileScreen;

