import React, { Component } from "react";
import orderAPI from "../../api/orderAPI";

export default class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {},
    };
  }

  componentDidMount() {
    this.getDetailOrder(this.props.match.params.id);
  }

  getDetailOrder = (id) => {
    orderAPI
      .getDetailOrder(id)
      .then((res) => {
        this.setState({ order: res.data });
      })
      .catch((e) => {
        console.log(e, "catch error in getDetailOrder");
      });
  };

  render() {
    const { id, name, price, address, status } = this.state.order;
    return (
      <div className="flex flex-col p-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-3xl text-gray-600">Order Detail</span>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 mt-4 mb-2">
            <h3 className="text-xl leading-6 font-medium text-gray-900">
              Order #{id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              See detail of order below
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-2 pt-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-lg font-medium text-gray-500">Order name</dt>
                <dd className="mt-1 text-lg text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {name}
                </dd>
              </div>
              <div className="bg-white px-4 py-2 pt-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-lg font-medium text-gray-500">Price (USD)</dt>
                <dd className="text-lg mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {price}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-2 pt-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-lg font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-lg capitalize text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {status}
                </dd>
              </div>
              <div className="bg-white px-4 py-2 pt-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-lg font-medium text-gray-500">Address</dt>
                <dd className="text-lg mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {address}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }
}
