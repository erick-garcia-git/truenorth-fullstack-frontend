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

  useEffect(() => {
    console.log('component mounted ')
    axios.get('http://localhost:4000/tasks')
      .then(({ data }) => {
        setTitles(data.titles)
      })
  }, [])

  return (
    <div className="container">
      <header>
        Task list
      </header>
      <div className="titles-container">
        {titles.map((task) => {
          return (
            <div className="grid-item" onClick={() => toggleModal(task)}>{task.title}</div>
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
