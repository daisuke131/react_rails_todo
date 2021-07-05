import React, { useState, useEffect } from 'react'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import axios from 'axios'

function HomeTodo() {
  const [todos, setTodos] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    getTodos()
  }, [])

  // 全件読み込み
  const getTodos = async () => {
    await axios.get('/api/v1/todos')
      .then(res => {
        setTodos(res.data);
      })
      .catch(e => {
        console.log(e);
      })
  }

  // 新規保存
  const saveTodo = async () => {
    var data = {
      name: name
    };

    await axios.post('/api/v1/todos', data)
      .then(resp => {
        const newTodo = [{ id: resp.data.id, name: resp.data.name, is_completed: resp.data.is_completed }]
        const newTodos = [...newTodo, ...todos]
        setTodos(newTodos)
        setName("")
      })
      .catch(e => {
        console.log(e)
      })
  };

  // テキストボックスの値が変わったらnameにセットする
  const handleChange = (e) => {
    setName(() => e.target.value)
  }

  // チェックボックス更新
  const updateIsCompleted = async (index, val) => {
    var data = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed
    }
    await axios.patch(`/api/v1/todos/${val.id}`, data)
      .then(resp => {
        const newTodos = [...todos]
        newTodos[index].is_completed = resp.data.is_completed
        setTodos(newTodos)
      })
      .catch(e => {
        console.log(e);
      })
  }

  // 指定データ削除
  const deleteTodo = async (index, id) => {
    await axios.delete(`/api/v1/todos/${id}`)
      .then(() => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
      })
      .catch(e => {
        console.log(e);
      })
  }

  // 全件削除
  const deleteAllTodo = async () => {
    const ret = confirm("Your file is being uploaded!")
    if (ret == true) {
      await axios.delete(`/api/v1/todos/destroy_all`)
        .then(() => {
          const newTodos = [];
          setTodos(newTodos);
        })
        .catch(e => {
          console.log(e);
        })
    }
  }


  return (
    <div>
      <h1>Todo</h1>
      <input type="text" required value={name} onChange={handleChange}></input>
      <button onClick={saveTodo}>登録</button>
      <ul>
        {todos.map((val, key) => {
          return (
            <li>
              {val.is_completed ? (
                <ImCheckboxChecked onClick={() => updateIsCompleted(key, val)} />
              ) : (
                <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, val)} />
              )}
              {val.name}
              <button onClick={() => deleteTodo(key, val.id)}>削除</button>
            </li>
          )
        }
        )}
      </ul>
      <button onClick={deleteAllTodo}>全件削除</button>
    </div>
  );
}

export default HomeTodo
