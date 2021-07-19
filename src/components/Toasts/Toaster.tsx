import { Toaster as T } from "react-hot-toast";

import styled from "styled-components/macro";

import { sizes } from "../../style/sizes";

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

const DEFAULT_INSET_RIGHT = "80px";

const Toaster = ({ sideBarOpen }: { sideBarOpen: boolean }) => (
  <ToasterWrapper>
    <T
      position="top-right"
      containerStyle={{
        right: sideBarOpen
          ? DEFAULT_INSET_RIGHT
          : `calc(${sizes.sideBarWidth} + ${DEFAULT_INSET_RIGHT})`,
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
