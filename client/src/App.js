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
  const [currentUserId, setCurrentUserId] = useState(null);
  const [errors, setErrors] = useState({
    name: false,
    age: false,
    email: false,
  });

  // User functionalities
  const createUser = () => {
    //Form filling check with field highlighting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validationErrors = {
      name: !name,
      age: age <= 0 || !age,
      email: email && !emailRegex.test(email),
    };

    setErrors(validationErrors);

    if (validationErrors.name || validationErrors.age || validationErrors.email) {
      let message = "";
      if (validationErrors.age) message += "Age must be higher than zero!";
      if (validationErrors.name) message += (message ? "\n\n" : "") + "Please, fill in 'Name' field!";
      if (validationErrors.email) message += (message ? "\n\n" : "") + "Invalid email format! Please enter a valid email address.";
      alert(message);
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
      resetForm();
      setErrors({ name: false, age: false, email: false });
    });
  };
  
  const updateUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validationErrors = {
      name: !name,
      age: age <= 0 || !age,
      email: email && !emailRegex.test(email),
    };
  
    setErrors(validationErrors);
  
    if (validationErrors.name || validationErrors.age || validationErrors.email) {
      let message = "";
      if (validationErrors.age) message += "Age must be higher than zero!";
      if (validationErrors.name) message += (message ? "\n\n" : "") + "Please, fill in 'Name' field!";
      if (validationErrors.email) message += (message ? "\n\n" : "") + "Invalid email format! Please enter a valid email address.";
      alert(message);
      return;
    }
  
    Axios.put(`http://localhost:3001/updateUser/${currentUserId}`, {
      name,
      age,
      username,
      date,
      email,
    }).then((response) => {
      alert("User updated successfully.");
      setListOfUsers(
        listOfUsers.map((user) =>
          user._id === currentUserId ? response.data : user
        )
      );
      setShowModal(false);
      resetForm();
      setErrors({ name: false, age: false, email: false });
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
    setDate(new Date().toISOString().split("T")[0]); // Set today's date
    setEmail("");
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setCurrentUserId(user._id);
      setName(user.name);
      setAge(user.age);
      setUsername(user.username);
      setDate(user.date ? new Date(user.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
      setEmail(user.email);
    } else {
      resetForm(); // Reset form fields including default date
      setCurrentUserId(null);
    }
    setShowModal(true);
  };
  
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
                    variant="warning"
                    size="sm"
                    onClick={() => handleShowModal(user)}
                    className="me-2"
                  >
                    Update
                  </Button>
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
          <Modal.Title>{currentUserId ? "Update User" : "Create New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                isInvalid={errors.name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) setErrors({ ...errors, name: false });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Age"
                value={age}
                isInvalid={errors.age}
                onChange={(event) => {
                  setAge(event.target.value);
                  if (errors.age) setErrors({ ...errors, age: false });
                }}
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
                isInvalid={errors.email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={currentUserId ? updateUser : createUser}>
            {currentUserId ? "Update User" : "Save User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
