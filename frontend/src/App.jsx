import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';

import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


const CSSTextField = withStyles({
  root: {
    '& .MuiInputBase-root': {
      color: 'white',
    },
  },
})(TextField);

const GET_TODOS = gql`
  {
    todos {
      _id
      task
      isCompleted
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($task: String!) {
    addTodo(task: $task) {
      _id
      task
      isCompleted
    }
  }
`;

const COMPLETE_TODO = gql`
  mutation CompleteTodo($todoId: ID!, $isCompleted: Boolean!) {
    completeTodo(todoId: $todoId, isCompleted: $isCompleted) {
      _id
      task
      isCompleted
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($todoId: ID!) {
    deleteTodo(todoId: $todoId)
  }
`;

const EDIT_TODO = gql`
  mutation EditTodo($todoId: ID!, $task: String!) {
    editTodo(todoId: $todoId, task: $task) {
      _id
      task
      isCompleted
    }
  }
`;

export default function App() {
  const [isEdit, setIsEdit] = useState(false);

  const [ID, setID] = useState(-1);
  
  const [open, setOpen] = useState(false);

  const [todoToBeDeleted, setTodoToBeDeleted] = useState('');

  const [inputs, setInputs] = useState({
    task: '',
  });

  const [editInput, setEditInput] = useState({
    task: '',
  });

  const {loading, error, data} = useQuery(GET_TODOS);

  const [addTodo] = useMutation(ADD_TODO, {
    update(cache, {data: {addTodo}}) {
      const {todos} = cache.readQuery({query: GET_TODOS});
      todos.unshift(addTodo);
      cache.writeQuery({
        query: GET_TODOS,
        data: {todos: todos},
      });
    },
  });

  const [completeTodo] = useMutation(COMPLETE_TODO);

  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, {data: {deleteTodo}}) {
      const {todos} = cache.readQuery({query: GET_TODOS});
      cache.writeQuery({
        query: GET_TODOS,
        data: {todos: todos.filter((todo) => todo._id !== deleteTodo)},
      });
    },
  });

  const [editTodo] = useMutation(EDIT_TODO);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setTodoToBeDeleted('');
  }

  const handleInputs = (event) => {
    event.persist();
    setInputs((inputs) => ({
      [event.target.id]: event.target.value,
    }));
  };

  const handleAddTodo = (event) => {
    if (inputs.task === '' || inputs.task === null || inputs.task.trim().length <= 0) {
      setInputs((inputs) => ({
        task: '',
      }));
      return;
    }
    event.preventDefault();
    addTodo({variables: {task: inputs.task}});
    setInputs((inputs) => ({
      task: '',
    }));
  };

  const handleCompleteTodo = (_id, completedArg) => () => {
    completeTodo({variables: {todoId: _id, isCompleted: !completedArg}});
  };

  const handleDeleteTodo = () => {
    deleteTodo({variables: {todoId: todoToBeDeleted}});
    setOpen(false);
  };

  const handleEditTodo = (_id, task) => () => {
    editTodo({variables: {todoId: _id, task: task}});
    setEditInput({
      task: '',
    });
  };

  const save = (_id, task) => () => {
    setIsEdit(false);
    setID(-1);
    if (task.trim().length <= 0 || task === null || task === '') {
      setEditInput({
        task: '',
      });
      return;
    }
    handleEditTodo(_id, task)();
  };

  const handleEditInput = (event) => {
    event.persist();
    setEditInput((inputs) => ({
      [event.target.id]: event.target.value,
    }));
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error!</div>;

  return (
    <Container maxWidth='sm'>
      <h1><center>Todo List</center></h1>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Delete this task?'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteTodo} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <form onSubmit={handleAddTodo} autocomplete="off">
        <CSSTextField
          id='task'
          value={inputs.task}
          label='+ Add Task'
          margin='normal'
          fullWidth
          variant='outlined'
          onChange={handleInputs}
          multiline={true}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          disabled={(inputs.task && inputs.task.trim().length > 0) ? false : true}
        >
          Submit
        </Button>
      </form>

      <List>
        {data.todos.map(({_id, task, isCompleted}) => {
          if (isEdit && _id == ID && _id != -1) {
            return (
              <ListItem
                key={_id}
                role={undefined}
                button
                divider
              >
                <CSSTextField
                id='task'
                value={editInput.task}
                margin='normal'
                fullWidth
                variant='outlined'
                onChange={handleEditInput}
                multiline={true}
                onBlur={save(_id, editInput.task)}
                />
                <Check onClick={save(_id, editInput.task)} />
              </ListItem>
            );
          } else {
              return (<ListItem
                key={_id}
                role={undefined}
                button
                divider
                onClick={handleCompleteTodo(_id, isCompleted)}
              >
                <ListItemIcon>
                  <Checkbox checked={isCompleted} />
                </ListItemIcon>
                <ListItemText
                  disabledTypography 
                  id={_id}
                  primary={<Typography variant="font">{task}</Typography>}
                  style={{textDecoration: isCompleted ? 'line-through' : 'none'}}
                />
                <ListItemSecondaryAction>
                  <IconButton edge='end'
                  onClick={() => {
                    setIsEdit(true);
                    setID(_id);
                    setEditInput({
                      task: task,
                    });
                  }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton edge='end'
                  onClick={() => {
                    setTodoToBeDeleted(_id);
                    handleClickOpen();
                  }}>
                    <DeleteForeverRoundedIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>);
            }
        })}
      </List>
    </Container>
  );
}