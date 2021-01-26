import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as _ from 'lodash';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { jaJP } from '@material-ui/core/locale';
import { ToastProvider, useToasts, DefaultToastContainer } from 'react-toast-notifications';
import ErrorBoundary from './errorBoundary';
import Drawer from './samples/drawer'


const theme = createMuiTheme({}, jaJP);

const ToastContainer = (props: any) => (
  <DefaultToastContainer
    css={{}}
    style={{ position: 'absolute', top: 5, right: 5, zIndex: 99999999 }}
    {...props}
  />
);

const Main = (): JSX.Element => {
  React.useEffect(() => {
  }, []);


  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Drawer />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

function App(): JSX.Element {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ToastProvider autoDismiss={true} autoDismissTimeout={4000} components={{ ToastContainer }} >
          <Main />
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
