import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./app/store";

import "../testing/mocks/matchMediaMock";
import App from "./App";

xtest("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
