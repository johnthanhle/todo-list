import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  ScrollView
} from "react-native";
import Bar from "./Bar";
import TodoList from "./TodoList";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function App() {
  const [title, setTitle] = useState("");

  // Initalize empty array to store todos
  const [todos, setTodos] = useState([]);

  // function to add todo object in todo list
  const addTodo = () => {
    if (title.trim().length > 0) {
      // Add todo to the list
      setTodos([...todos, { key: Date.now(), name: title, isChecked: false }]);
      // clear the value of the textfield
      setTitle("");
    }
  };

  // function to mark todo as checked or unchecked
  const checkTodo = id => {
    // loop through todo list and look for the the todo that matches the given id param
    // update the state using setTodos function
    setTodos(
      todos.map(todo => {
        if (todo.key === id) {
          todo.isChecked = !todo.isChecked;
        }
        return todo;
      })
    );
  };

  const editTodo = (id, name) => {
    if (name !== undefined && name.trim().length > 0 ) {
        setTodos(
          todos.map(todo => {
            if (todo.key === id) {
              todo.name = name;
            }
            return todo;
          })
      );
    }
  };

  const deleteTodo = id => {
    setTodos(todos.filter(todo => {
      return todo.key !== id;
    }));
  };

  useEffect(() => {
    console.log(todos.length, "TodoList length");
  }, [todos]);

  return (
    <View style={styles.container}>
      <View style={styles.statusBar}></View>
      <Bar />
      <View style={styles.todo}>
        <TextInput
          placeholder="Add a task!"
          value={title}
          onChangeText={value => setTitle(value)}
          style={styles.textbox}
        />
        <Icon name="add" size={25} color="#0072c1" onPress={() => addTodo()} />
      </View>
      <ScrollView>
        {todos.map(todo => (
          <TodoList
            key={todo.key}
            todo={todo}
            checkTodo={checkTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#0072c1",
    color: "#fff",
    width: "100%",
    height: 30
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  todo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  textbox: {
    borderWidth: 1,
    borderColor: "#0072c1",
    borderRadius: 8,
    padding: 10,
    margin: 10,
    width: "80%"
  }
});