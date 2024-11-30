import { unwrapResult } from "@reduxjs/toolkit";
import { listenToCuisines } from "app/redux/thunks/cuisines";
import { Component } from "react";
import { connect, ConnectedProps } from "react-redux";

interface Props extends ReduxProps {}

class AdminDataLoading extends Component<Props> {
  listeners = new Set<() => void>();

  componentDidMount(): void {
    this.attachListeners();
  }

  componentWillUnmount(): void {
    this.detachListeners();
  }

  async attachListeners() {
    const cuisinesListener = await this.props
      .listenToCuisines()
      .then(unwrapResult);
    this.listeners.add(cuisinesListener);
  }

  detachListeners() {
    this.listeners.forEach((l) => l());
  }

  render() {
    return null;
  }
}

const mapDispatch = {
  listenToCuisines,
};

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(AdminDataLoading);
