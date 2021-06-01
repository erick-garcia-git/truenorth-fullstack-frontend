import './App.css';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '50%'
  }
};

function App () {
  const [completedTasks, setCompletedTasks] = useState([])
  const [typeOfTasks, setTypeOfTasks] = useState('active')
  const [numberOfTasksToFetch, setNumberOfTasksToFetch] = useState(3)
  const [titles, setTitles] = useState([])
  const [modalIsOpen, setIsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState({})

  function toggleModal (taskObj) {
    if (modalIsOpen) {
      setIsOpen(false);
      setSelectedTask({})
    } else {
      setSelectedTask(taskObj)
      setIsOpen(true)
    }
  }

  function completeTask (task) {
    axios({
      method: 'PUT',
      url: 'http://localhost:4000/tasks',
      data: task,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(() => {
      const filterTasks = titles.filter(title => title.id !== task.id)
      setTitles(filterTasks)
      toggleModal()
    })
  }

  function fetchTasks (numberOfTasks) {
    axios.get(`http://localhost:4000/tasks?quantity=${numberOfTasks}`)
      .then(({ data }) => {
        setTitles(data.titles)
        setCompletedTasks(data.titlesCompleted)
      })
  }

  function onChangeNumberOfTasksToFetch (evt) {
    const value = evt.target.value
    setNumberOfTasksToFetch(value)
  }

  useEffect(() => {
    fetchTasks(numberOfTasksToFetch)
  }, [numberOfTasksToFetch])

  const tasksToShow = typeOfTasks === 'active' ? titles : completedTasks
  const classForTask = `grid-item ${typeOfTasks}`
  return (
    <div className="container">
      <header>
        Task list
      </header>
      <div className="filters-container">
        <div>Tasks to fetch <input type="text" placeholder="Number of tasks" onChange={(evt) => onChangeNumberOfTasksToFetch(evt)} /></div>
        <div>
          Change type of tasks
          <select onChange={(evt) => setTypeOfTasks(evt.target.value)}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="titles-container">
        {tasksToShow.map((task) => {
          return (
            <div key={task.id} className={classForTask} onClick={() => {
              if (typeOfTasks === 'active') {
                toggleModal(task)
              }
            }}>{task.title}</div>
          )
        })}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        style={customStyles}
      >
        <div>
          {selectedTask.title}
          <div className="buttons-container">
            <button onClick={() => completeTask(selectedTask)}>Complete</button>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
