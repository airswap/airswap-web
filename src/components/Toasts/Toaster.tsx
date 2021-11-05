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

type ToasterPropType = {
  open: boolean;
};

const Toaster = ({ open }: ToasterPropType) => (
  <ToasterWrapper>
    <T
      position="top-right"
      containerStyle={{
        right: open ? "25rem" : "1rem",
        transform: `${(open: boolean) =>
          open ? "translateX(0)" : "translateX(24rem)"}`,
        transition: "transform 0.3s ease-in-out",
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
