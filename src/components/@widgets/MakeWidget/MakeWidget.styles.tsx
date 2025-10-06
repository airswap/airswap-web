import styled from "styled-components/macro";

import breakPoints from "../../../style/breakpoints";
import { sizes } from "../../../style/sizes";
import { SelectLabel } from "../../../styled-components/Select/Select";
import { SelectButtonText } from "../../Dropdown/Dropdown.styles";
import { Notice } from "../../Notice/Notice";
import { Container as PageNavigation } from "../../PageNavigation/PageNavigation.styles";
import SwapInputs from "../../SwapInputs/SwapInputs";
import Tooltip from "../../SwapInputs/subcomponents/Tooltip/Tooltip";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import AddressInput from "./subcomponents/AddressInput/AddressInput";
import { ExpirySelector } from "./subcomponents/ExpirySelector/ExpirySelector";
import {
  Input,
  StyledDropdown,
} from "./subcomponents/ExpirySelector/ExpirySelector.styles";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import OrderTypeSelector from "./subcomponents/OrderTypeSelector/OrderTypeSelector";
import { RateField } from "./subcomponents/RateField/RateField";

export const Container = styled.div<{ hidePageNavigation: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  ${({ hidePageNavigation }) =>
    hidePageNavigation &&
    `& + ${PageNavigation} {
      display: none;
    }
  `}
`;

export const StyledSwapInputs = styled(SwapInputs)``;

export const StyledOrderTypeSelector = styled(OrderTypeSelector)`
  margin-bottom: ${sizes.widgetGutter};
  width: calc(46% - ${sizes.widgetGutter});
}
`;

export const OrderTypeSelectorAndExpirySelectorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${sizes.widgetGutter};
`;

export const StyledExpirySelector = styled(ExpirySelector)<{
  fullWidth: boolean;
  hideExpirySelector: boolean;
}>`
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "54%")};
  transition: opacity 0.3s ease-out;
  ${({ fullWidth }) => fullWidth && "margin-inline-start: 0;"};
  margin-block-end 1rem;
  visibility: ${({ hideExpirySelector }) =>
    hideExpirySelector ? "hidden" : "visible"};

  ${SelectLabel} {
    ${({ fullWidth }) => fullWidth && "flex-grow: 1;"};
  }

  ${Input} {
    ${({ fullWidth }) => fullWidth && "width: 3rem;"};
  }

  ${StyledDropdown} {
    ${({ fullWidth }) => fullWidth && "flex-grow: 0;"};
    ${({ fullWidth }) => fullWidth && "width: 10rem;"};
  }

  ${SelectButtonText} {
    ${({ fullWidth }) => fullWidth && "width: 100%;"};
  }
`;

export const StyledAddressInput = styled(AddressInput)`
  margin-bottom: ${sizes.widgetGutter};
  height: 3.5rem;
`;

export const StyledActionButtons = styled(ActionButtons)`
  margin-block-start: 1rem;
`;

export const StyledInfoSection = styled(InfoSection)`
  flex-grow: 1;

  & + ${StyledActionButtons} {
    margin-top: 1rem;
  }
`;

export const StyledTooltip = styled(Tooltip)`
  position: absolute;
  right: 0;
  top: -5.125rem;

  @media ${breakPoints.tabletLandscapeUp} {
    top: 0;
    height: 3.5rem;
  }
`;

export const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const StyledRateField = styled(RateField)`
  margin-inline: auto;
  margin-block-start: 1rem;

  @media ${breakPoints.phoneOnly} {
    width: auto;
  }
`;

export const StyledNotice = styled(Notice)`
  margin-block-start: ${sizes.widgetGutter};
`;
