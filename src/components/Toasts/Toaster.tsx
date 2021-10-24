import { Toaster as T } from "react-hot-toast";

import styled from "styled-components/macro";

const ToasterWrapper = styled.div`
  div[role="status"] {
    margin: 0;
  }
  div {
    max-width: 100%;
    border-radius: 0.5rem;
    background: transparent;
  }
`;

const Toaster = () => (
  <ToasterWrapper>
    <T
      position="top-right"
      containerStyle={{
        right: "80px",
      }}
      toastOptions={{
        style: {
          padding: 0,
          margin: 0,
          borderRadius: 0,
        },
      }}
    ></T>
  </ToasterWrapper>
);

export default Toaster;
