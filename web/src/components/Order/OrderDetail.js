import React, {Component} from 'react'
import Button from 'react-bootstrap/Button';
import orderAPI from '../../api/orderAPI';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
			order: {}
        }
	}
		
	componentDidMount() {
		this.getDetailOrder(this.props.match.params.id)
	}

	getDetailOrder = (id) => {
		orderAPI.getDetailOrder(id)
		.then(res => {
			this.setState({order: res.data})
		})
		.catch(e => {
			console.log(e, 'catch error in getDetailOrder')
		})
    }

	// fetchListOrder = async () => {
	// 	let params = {
	// 		last_modified: this.state.lastModified
	// 	}
	// 	await orderAPI.fetchListOrder(params)
	// 	.then(res => {
	// 		if (res.data.success) {
	// 			this.getListOrders()
	// 		} else {
	// 			this.fetchListOrder(params)
	// 		}
	// 	})
	// }


	render() {
			const {id, name, price} = this.state.order;
			return (
					<div className="flex flex-col p-8">
						Detail Order
						<p>Id: {id}</p>
						<p>Name: {name}</p>
						<p>Price: {price}</p>
					</div>
			)
    }
}

