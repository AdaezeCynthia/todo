"use client";
import React, { useState, useEffect } from "react";

export interface todos {
  id: number;
  title: string;
  completed: boolean;
}

const List = () => {
  const [todos, setTodos] = useState<todos[]>([]);
  const [todoName, setTodoName] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Error parsing todos from localStorage", error);
    }
  }, []);

  const addTodos = () => {
    if (!todoName.trim()) return;

    const newTodo = {
      id: Math.random(),
      title: todoName,
      completed: false,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setTodoName("");
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: number) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };
  const startEditing = (id: number, currentTitle: string) => {
    setEditingId(id);
    setNewTitle(currentTitle);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setNewTitle("");
  };
  const updateTodo = (id: number) => {
    const newTodos = todos.map((t) => {
      if (t.id === id) {
        return { ...t, title: newTitle };
      }
      return t;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
    cancelEditing();
  };

  const checkTodo = (id: number) => {
    const newTodos = todos.map((t) => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  return (
    <div className="h-full w-full flex justify-center items-center flex-col space-y-10">
      <div className="p-4 flex flex-col space-y-2 text-black">
        <textarea
          value={todoName}
          onChange={(e) => setTodoName(e.target.value)}
          className="p-4 rounded border border-solid border-gray-800"
        />
        <button
          className="p-4 ml-4 bg-green-700 rounded hover:bg-green-500 text-white font-bold"
          onClick={addTodos}
        >
          Add Event
        </button>
      </div>
      <div className="flex flex-col w-full justify-center items-center">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center w-1/3 my-2 bg-gray-600 p-4 bg-opacity-30 border border-solid border-gray-800 rounded"
          >
            <div className="flex flex-row space-x-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => checkTodo(todo.id)}
                className="h-6 w-6"
              />
              <div
                className={`text-xl font-semibold ml-2 ${
                  todo.completed ? "line-through" : ""
                }`}
              >
                {todo.title}
              </div>
            </div>
            {editingId === todo.id ? (
              <div className="flex flex-row space-x-2 items-center">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="p-2 border border-gray-800 rounded"
                />
                <button
                  onClick={() => updateTodo(todo.id)}
                  className="bg-green-600 p-2 rounded-xl hover:bg-green-800 text-white font-medium"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-600 p-2 rounded-xl hover:bg-gray-800 text-white font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditing(todo.id, todo.title)}
                className="bg-blue-600 p-2 rounded-xl hover:bg-blue-800 text-white font-medium"
              >
                update
              </button>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-950 p-2 rounded-xl hover:bg-gray-700 text-white font-medium "
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
