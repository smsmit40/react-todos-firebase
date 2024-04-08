import './App.css';
import {useState, useEffect} from "react";
import { db } from "./firebase"
import {collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

function App() {

   const [list, setList] = useState([])
    const [todo, setTodo] = useState("");
    const [selectedDate, setSelectedDate] = useState('1990-01-01');
    const [status, setStatus] = useState('NEW');
    const [editFlag, setEditFlag] = useState(false);
    const [editId, setEditId] = useState("")

  const getTodos = async () => {
      const todosCollection = await getDocs(collection(db, "todos"));
      const todosData = todosCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setList(todosData);
  }

  const addTodo = async () => {
      if (editFlag) {
          const washingtonRef = doc(db, "todos", editId);
          await updateDoc(washingtonRef, {
              title: todo,
              date: selectedDate,
              status: status,
          });
      }
        else {
            const docRef = await addDoc(collection(db, 'todos'), {
              title: todo,
              date: selectedDate,
              status: status,
          })
      };

      setTodo("");
      setSelectedDate(setDefaultDate());
      setStatus("NEW");
      setEditFlag(false)
      setEditId("");
      getTodos();

  }

  const deleteTodo = async (id) => {
      const todo = await deleteDoc(doc(db, "todos", id));
      setEditFlag(false);
      getTodos();

  }

  const SeteditTodo = async (id) => {
      const docRef = await doc(db, "todos", id );
      const docSnap = await getDoc(docRef);
      const todoItem = docSnap.data()

      setEditFlag(true);
      setEditId(id);
      setStatus(todoItem.status);
      setTodo(todoItem.title);
      setSelectedDate(todoItem.date)
  }

  const setDefaultDate = () => {
      const date = new Date();
      date.setDate(date.getDate() + 10);
      const formattedDate = date.toISOString().slice(0, 10);
      return formattedDate;
  }

    useEffect(() => {
        getTodos();
        setSelectedDate(setDefaultDate());

    }, []);
  return (
    <div className="App">
      <h1 className="text-3xl font-bold">
        Todo List
      </h1>
        <center>
        <form className="bg-gray-200 p-4 rounded-lg w-5/6 mt-8">
            <label className="block mb-2">
                Title:
                <input
                    type="text"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    className="block w-full mt-1 w-5/6 border-gray-300 rounded-md"
                />
            </label>

            <label htmlFor=""> Due Date

                <br/>
                <input
                    type="date"
                    value={selectedDate}
                    className='w-5/6'
                    onChange={(e) => setSelectedDate(e.target.value.toString())}
                />
            </label>
            <br/>
            <label>
                Status:
                <br/>
                <select className="w-5/6" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="COMPLETE">Complete</option>

                </select>
            </label>
            <br/>
            <br />
            <button onClick={ addTodo } type="button" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                Submit
            </button>
        </form>
        </center>

        <div className="flex justify-center mt-16">
        <table className="border border-black bg-blue-100 w-5/6 overflow-y-auto">
            <thead>
            <th>Id</th>
            <th>Title</th>
            <th>isComplete</th>
            <th></th>
            </thead>
            {list.map(todo => (
                <tr>
                    <td>{todo.id}</td>
                    <td>{todo.title}</td>
                    <td>{todo.status}</td>
                    <td>
                        <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white py-2 px-4 rounded-md mr-2">Delete Todo</button>
                        <button onClick={() => SeteditTodo(todo.id)} className="bg-blue-500 text-white py-2 px-4 rounded-md">Edit Todo</button>
                    </td>
                {/*<li key={todo.id}>{todo.title}</li>*/}
                </tr>
            ))}
        </table>
        </div>
    </div>
  );
}

export default App;
