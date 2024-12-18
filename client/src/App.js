import { useState, useEffect } from "react";
import './App.css';
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Form, Modal, Table, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Added Link here

function User() {
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

  const createUser = () => {
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
      .then(response => {
        setListOfUsers(listOfUsers.filter(user => user._id !== id));
        console.log(response.data.message);
      })
      .catch(error => console.error(error));
  };

  const resetForm = () => {
    setName("");
    setAge(0);
    setUsername("");
    setDate(new Date().toISOString().split("T")[0]);
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
      resetForm();
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
    <Container>
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

      {/* Modal for adding/updating user */}
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
    </Container>
  );
}

function Product() {
  const [listOfProducts, setListOfProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    category: false,
  });

  const createProduct = () => {
    let validationErrors = {
      name: !name,
      price: price <= 0 || !price,
      category: !category,
    };

    setErrors(validationErrors);

    if (validationErrors.name || validationErrors.price || validationErrors.category) {
      let message = "";
      if (validationErrors.price) message += "Price must be higher than zero!";
      if (validationErrors.name) message += (message ? "\n\n" : "") + "Please, fill in 'Name' field!";
      if (validationErrors.category) message += (message ? "\n\n" : "") + "Please, fill in 'Category' field!";
      alert(message);
      return;
    }

    Axios.post("http://localhost:3001/createProduct", {
      name: name,
      price: price,
      category: category,
    }).then((response) => {
      alert("Product is added.");
      setListOfProducts([...listOfProducts, response.data]);
      setShowModal(false);
      resetForm();
      setErrors({ name: false, price: false, category: false });
    });
  };

  const updateProduct = () => {
    let validationErrors = {
      name: !name,
      price: price <= 0 || !price,
      category: !category,
    };

    setErrors(validationErrors);

    if (validationErrors.name || validationErrors.price || validationErrors.category) {
      let message = "";
      if (validationErrors.price) message += "Price must be higher than zero!";
      if (validationErrors.name) message += (message ? "\n\n" : "") + "Please, fill in 'Name' field!";
      if (validationErrors.category) message += (message ? "\n\n" : "") + "Please, fill in 'Category' field!";
      alert(message);
      return;
    }

    Axios.put(`http://localhost:3001/updateProduct/${currentProductId}`, {
      name,
      price,
      category,
    }).then((response) => {
      alert("Product updated successfully.");
      setListOfProducts(
        listOfProducts.map((product) =>
          product._id === currentProductId ? response.data : product
        )
      );
      setShowModal(false);
      resetForm();
      setErrors({ name: false, price: false, category: false });
    });
  };

  const deleteProduct = (id) => {
    Axios.delete(`http://localhost:3001/products/${id}`)
      .then(response => {
        setListOfProducts(listOfProducts.filter(product => product._id !== id));
        console.log(response.data.message);
      })
      .catch(error => console.error(error));
  };

  const resetForm = () => {
    setName("");
    setPrice(0);
    setCategory("");
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setCurrentProductId(product._id);
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
    } else {
      resetForm();
      setCurrentProductId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/getProducts").then((response) => {
      setListOfProducts(response.data);
    });
  }, []);

  return (
    <Container>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listOfProducts.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleShowModal(product)}
                  className="me-2"
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Button to open modal/Add product functionality */}
      <div className="text-end mt-3">
        <Button variant="success" onClick={handleShowModal}>
          Add New Product
        </Button>
      </div>

      {/* Modal for adding/updating products */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProductId ? "Update Product" : "Create New Product"}</Modal.Title>
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
                placeholder="Price"
                value={price}
                isInvalid={errors.price}
                onChange={(event) => {
                  setPrice(event.target.value);
                  if (errors.price) setErrors({ ...errors, price: false });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Category"
                value={category}
                isInvalid={errors.category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  if (errors.category) setErrors({ ...errors, category: false });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={currentProductId ? updateProduct : createProduct}>
            {currentProductId ? "Update Product" : "Save Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function App() {
  const [currentView, setCurrentView] = useState("users");

  return (
    <Router>
      <div className="App">
        <Container className="mt-4">
          <Row>
            <Col xs={12}>
              <div className="d-flex gap-4">
                <h2
                  className={`mb-3 clickable-title ${
                    currentView === "users" ? "active-title" : ""
                  }`}
                  onClick={() => setCurrentView("users")}
                >
                  <Link to="/">Users List</Link>
                </h2>
                <h2
                  className={`mb-3 clickable-title ${
                    currentView === "products" ? "active-title" : ""
                  }`}
                  onClick={() => setCurrentView("products")}
                >
                  <Link to="/product">Products List</Link>
                </h2>
              </div>
            </Col>
          </Row>
          <Routes>
            <Route path="/" element={<User />} />
            {/* <Route path="/user" element={<User />} /> */}
            <Route path="/product" element={<Product />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
