import React, {Component} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default class ModalCreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            price: 0,
        }
	}
		
	componentDidMount() {
    }

    handleClose = () => {
        this.props.closeModal(false);
    }
    
    render() {
			return (
                <div>
                    <Modal show={this.props.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
			)
    }
}

