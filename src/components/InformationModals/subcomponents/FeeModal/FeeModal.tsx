import React, { FC } from "react";

import {
  ModalParagraph,
  ScrollableModalContainer,
} from "../../../../styled-components/Modal/Modal";

const FeeModal: FC = () => {
  return (
    <ScrollableModalContainer>
      <ModalParagraph>Fee text here</ModalParagraph>
    </ScrollableModalContainer>
  );
};

export default FeeModal;
