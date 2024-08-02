import { FC, ReactElement, useContext } from "react";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { InterfaceContext } from "../../../../../contexts/interface/Interface";
import {
  setDisableLastLook,
  setDisableRfq,
} from "../../../../../features/quotes/quotesSlice";
import {
  Container,
  StyledCheckbox,
  StyledCloseButton,
} from "./DebugMenu.styles";

interface DebugMenuProps {
  className?: string;
}

const DebugMenu: FC<DebugMenuProps> = ({ className = "" }): ReactElement => {
  const dispatch = useAppDispatch();

  const { disableLastLook, disableRfq } = useAppSelector(
    (state) => state.quotes
  );

  const { setIsDebugMode } = useContext(InterfaceContext);

  const handleLastLookCheckBoxChange = (isChecked: boolean) => {
    dispatch(setDisableLastLook(isChecked));
  };

  const handleDisableRFQCheckboxChange = (isChecked: boolean) => {
    dispatch(setDisableRfq(isChecked));
  };

  const handleCloseButtonClick = () => {
    setIsDebugMode(false);
  };

  return (
    <Container className={className}>
      <h3>Debug</h3>
      <StyledCheckbox
        label="Disable LastLook"
        checked={disableLastLook}
        onChange={handleLastLookCheckBoxChange}
      />
      <StyledCheckbox
        label="Disable RFQ"
        checked={disableRfq}
        onChange={handleDisableRFQCheckboxChange}
      />
      <StyledCloseButton icon="close" onClick={handleCloseButtonClick} />
    </Container>
  );
};

export default DebugMenu;
