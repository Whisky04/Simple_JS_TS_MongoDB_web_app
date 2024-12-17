import { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Form, Modal, Table } from "react-bootstrap";

function App() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [username, setUsername] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  // User functionalities
  const createUser = () => {
    if (age <= 0 || !name) {
      let message = "";
      if (age <= 0) message += "Age must be higher than zero!";
      if (!name) message += (message ? "\n\n" : "") + "Please, fill in 'Name' field!";
      alert(message);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format! Please enter a valid email address.");
      return;
    }

    Axios.post("http://localhost:3001/createUser", {
      name: name,
      age: age,
      username: username,
      date: date,
      email: email,
    }).then((response) => {
      alert("User is added.");
      setListOfUsers([...listOfUsers, response.data]);
      setShowModal(false);
    });
  };
  
  const deleteUser = (id) => { 
    Axios.delete(`http://localhost:3001/users/${id}`) 
    .then(response => { setListOfUsers(listOfUsers.filter(user => user._id !== id)); 
    console.log(response.data.message); }) 
    .catch(error => console.error(error)); 
  }; 

  const resetForm = () => {
    setName("");
    setAge(0);
    setUsername("");
    setDate(new Date().toISOString().split('T')[0]);
    setEmail("");
  };

  const handleShowModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Hide modal
  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/getUsers").then((response) => {
      setListOfUsers(response.data);
    });
  }, []);

  return (
    <div className="App">
      {/* User Table */}
      <Container className="mt-4">
        <h2 className="text-start mb-3">User List</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Username</th>
              <th>Date of Reporting</th>
              <th>E-mail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listOfUsers.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.username}</td>
                <td>{user.date ? new Date(user.date).toISOString().split('T')[0] : ""}</td>
                <td>{user.email}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {/* Button to open modal/Add user functionality */}
        <div className="text-end mt-3">
          <Button variant="success" onClick={handleShowModal}>
            Add New User
          </Button>
        </div>
      </Container>

      {/* Modal for adding user */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Age"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={createUser}>
            Save User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
