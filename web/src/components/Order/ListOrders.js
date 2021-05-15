import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import ModalCreateOrder from "./Modal/ModalCreateOrder";
import orderAPI from "../../api/orderAPI";
import OrderDetail from "./OrderDetail";
import { Route, NavLink } from "react-router-dom";

export default class ListOrders extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      listOrders: [],
      isLoaded: false,
      error: null,
      isShowModalCreateOrder: false,
      lastModified: null,
    };
  }

  componentDidMount() {
    this.getListOrders();
  }

  getListOrders = () => {
    orderAPI
      .getListOrders()
      .then((res) => {
        this.setState({
          isLoaded: true,
          listOrders: res.data.list_orders || [],
          lastModified: res.data.last_modified || null,
        });
        this.fetchListOrder();
      })
      .catch((e) => {
        console.log(e, "catch error in getListOrders ");
      });
  };

  fetchListOrder = async () => {
    if (this.props.match.url !== "/") return;
    let params = {
      last_modified: this.state.lastModified,
    };
    await orderAPI.fetchListOrder(params).then((res) => {
      if (res.data.has_new_data) {
        this.getListOrders();
      } else {
        this.fetchListOrder(params);
      }
    });
  };

  canCancelOrder = (status) => {
    return ["created", "confirmed"].includes(status);
  };

  cancelOrder = (nmbr, orderIndex) => {
    if (!window.confirm("Do you want to cancel order?")) return;
    orderAPI
      .cancelOrder(nmbr)
      .then((res) => {
        let newListOrders = [...this.state.listOrders];
        newListOrders[orderIndex].status = "cancelled";
        this.setState({ listOrders: newListOrders });
      })
      .catch((e) => {
        console.log(e, "catch error in cancelOrder ");
      });
  };

  showModalCreateOrder = () => {
    this.setState({
      isShowModalCreateOrder: true,
    });
  };

  toggleModalCreateOrder = (isShow) => {
    this.setState({ isShowModalCreateOrder: isShow });
  };

  renderTableData(url) {
    return (
      this.state.listOrders &&
      this.state.listOrders.map((order, index) => {
        const { id, name, price, status, nmbr } = order;
        return (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">{name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-center">{price}</td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              {status}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              {/* <Button variant="outline-info mr-3">Detail</Button> */}
              <NavLink
                key={index}
                to={`${url}order/${id}`}
                target="_blank"
                className="no-underline btn btn-info mr-3"
              >
                Detail
              </NavLink>
              <Route path={`${url}ordertt`} component={OrderDetail} />
              {true && (
                <Button
                  variant="outline-success"
                  onClick={this.cancelOrder.bind(this, nmbr, index)}
                >
                  Cancel
                </Button>
              )}
            </td>
          </tr>
        );
      })
    );
  }

  handleClose = () => {
    this.props.show = false;
  };

  render() {
    var { match } = this.props;
    console.log(match, "match");
    var url = match.url;
    return (
      <div className="flex flex-col p-8">
        <ModalCreateOrder
          ref={this.wrapper}
          showModal={this.state.isShowModalCreateOrder}
          closeModal={this.toggleModalCreateOrder}
          createSuccess={this.getListOrders}
        />
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-3xl text-gray-600">List Orders</span>
          <Button variant="primary" onClick={this.showModalCreateOrder}>
            Create Order
          </Button>
        </div>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {this.renderTableData(url)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
