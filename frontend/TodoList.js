import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TodoList(props) {
  return (
    <View style={styles.listTitle}>
      <Icon
        name={props.todo.isChecked ? "check-box" : "check-box-outline-blank"}
        style={styles.leading}
        size={20}
        color="#666666"
        onPress={() => props.checkTodo(props.todo.key)}
      />
      <Text style={styles.title}>{props.todo.name}</Text>
      <Icon
        name="create"
        style={styles.trailing}
        size={20}
        color="#666666"
        onPress={() => props.editTodo(props.todo.key)}
      />
      <Icon
        name="delete-forever"
        style={styles.trailing}
        size={20}
        color="#666666"
        onPress={() => props.deleteTodo(props.todo.key)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listTitle: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#666666"
  },
  leading: {
    width: "5%"
  },
  title: {
    width: "60%",
    fontSize: 18
  },
  trailing: {
    width: "5%"
  }
});