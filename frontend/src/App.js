import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState({ text: "", isClicked: false });
  const [todos, setTodos] = useState([]);

  const fetchTodos = () => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = () => {
    if (todo.text === "") {
      return alert("*Enter Your Todo");
    }
    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then(() => {
      fetchTodos();
      setTodo({ text: "", isClicked: false });
    });
  };

  const toggleCheckbox = async (item) => {
    const updatedBool = item.target.checked;
    const itemId = item.target.id;
    const upDateSetTodos = todos.map((each) =>
      each._id === itemId ? { ...each, isClicked: updatedBool } : each,
    );
    setTodos(upDateSetTodos);
    await fetch(`http://localhost:5000/todos/${itemId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        isClicked: updatedBool,
      }),
    });
  };

  const deleteTodo = async (event) => {
    const delId = event.target.id;
    const upDateTodoList = todos.filter((each) => each._id !== delId);
    setTodos(upDateTodoList);

    await fetch(`http://localhost:5000/todos/${delId}`, {
      method: "DELETE",
    });
  };

  const deleteAll = async () => {
    await fetch("http://localhost:5000/todos", {
      method: "DELETE",
    });
    setTodos([]);
  };

  return (
    <div className="bg-Container">
      <h1 className="todoHeading">Todos</h1>

      <div className="inputContainer">
        <h3 className="tasksHeading">Create Tasks</h3>
        <input
          type="text"
          value={todo.text}
          className="inputEl"
          placeholder="Enter Your Todo..."
          onChange={(e) => setTodo({ text: e.target.value, isClicked: false })}
        />
        <button className="addBtn" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="todoContainer">
        <h3 className="tasksHeading">Your Tasks</h3>
        {todos.map((item) => (
          <li className="eachListEl" key={item._id}>
            <input
              onChange={toggleCheckbox}
              checked={item.isClicked}
              id={item._id}
              type="checkbox"
              className="checkbox"
            />
            <div className="eachTodo">
              <label
                style={{
                  textDecoration: item.isClicked ? "line-through" : "none",
                }}
                htmlFor={item._id}
              >
                {item.text}
              </label>
              <i
                id={item._id}
                onClick={deleteTodo}
                className="fa-solid fa-trash"
              ></i>
            </div>
          </li>
        ))}
      </ul>

      <div className="deleteAllCont">
        <button className="deleteBtn" onClick={deleteAll}>
          DeleteAll
        </button>
      </div>
    </div>
  );
}

export default App;
