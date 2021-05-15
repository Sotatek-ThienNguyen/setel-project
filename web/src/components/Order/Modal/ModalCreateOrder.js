import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import orderAPI from "../../../api/orderAPI";

export default class ModalCreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      price: 0,
    };
  }

  componentDidMount() {
}

handleClose = () => {
    this.resetData();
    this.props.closeModal(false);
  };

  resetData = () => {
    this.setState({ name: "", address: "", price: 0 });
  };

  handeChange = (event) => {
    let fieldName = event.target.name;
    let fieldVal = event.target.value;
    this.setState({ ...this.state, [fieldName]: fieldVal });
  };

  createOrder = () => {
    var data = {
      name: this.state.name,
      price: this.state.price,
      address: this.state.address,
    };
    orderAPI
      .createOrder(data)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.props.createSuccess();
        }
        this.handleClose();
      })
      .catch((err) => {
        console.log(err, "catch error when create order");
      });
  };

  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter order name"
                  onChange={this.handeChange.bind(this)}
                  defaultValue={this.state.name}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  onChange={this.handeChange.bind(this)}
                  defaultValue={this.state.price}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  onChange={this.handeChange.bind(this)}
                  defaultValue={this.state.address}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.createOrder}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
