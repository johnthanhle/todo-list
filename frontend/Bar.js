import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Bar(){
  return (
    <View style={styles.bar}>
      <Text style={styles.heading}>Todo List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#0072c1",
    color: "white",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "400"
  }
});