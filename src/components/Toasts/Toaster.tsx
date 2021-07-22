import { Toaster as T } from "react-hot-toast";
import styled from "styled-components/macro";

const ToasterWrapper = styled.div`
  div[role="status"] {
    margin: 0;
  }
`;

const Toaster = () => (
  <ToasterWrapper>
    <T
      position="bottom-left"
      toastOptions={{
        style: {
          padding: 0,
          margin: 0,
          borderRadius: 0,
          border: "1px solid #2B2B2B",
        },
      }}
    ></T>
  </ToasterWrapper>
);

export default Toaster;
