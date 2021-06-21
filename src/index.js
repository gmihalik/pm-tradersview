import ReactDOM from "react-dom";
import store from "./app/store";
import { Provider } from "react-redux";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
