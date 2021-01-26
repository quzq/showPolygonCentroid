import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

class ErrorBoundary extends React.Component {
  public state = {
    redirect: false,
    hasError: false,
  };
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, redirect: false };
  }
  public static getDerivedStateFromError() {
    return { hasError: true };
  }
  // set the types for error  and info
  public componentDidCatch(error: any, info: React.ErrorInfo) {
    //console.log(e)
    if (error.status === 401) {
      this.setState({ ...this.state, redirect: true });
    }
    console.error('ErrorBoundary caught an error', error, info);
  }
  public componentDidUpdate() {
    // if (this.state.hasError) {
    //   setTimeout(() => this.setState({ redirect: true }), 5000);
    // }
  }

  onClickHome = (): void => {
    // home へ移動
    this.setState({ ...this.state, redirect: true });
  };

  public render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    if (this.state.hasError) {
      return (
        <h1>
          render failed.{' '}
          <Link component="button" onClick={this.onClickHome}>
            Click here
          </Link>{' '}
          to back to the home page
        </h1>
      );
    }

    return this.props.children;
  }
}
//export default withRouter(ErrorBoundary);
export default ErrorBoundary;
