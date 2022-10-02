// TODO: I'd like to Phase this out with the new ErrorList component
import { useTranslation } from "react-i18next";

import type { ErrorType } from "../../constants/errors";
import { OverlayActionButton } from "../Overlay/Overlay.styles";
import {
  Container,
  StyledErrorList,
  LegendDivider,
  StyledScrollContainer,
} from "./OrderErrorList.styles";
import ErrorListItem from "./subcomponents/ErrorListItem/ErrorListItem";

type ErrorListProps = {
  errors: ErrorType[];
  handleClick: () => void;
};

export const OrderErrorList = ({
  errors = [],
  handleClick,
}: ErrorListProps) => {
  const { t } = useTranslation();

  return (
    <Container>
      <LegendDivider />
      <StyledScrollContainer>
        <StyledErrorList>
          {errors.map((error) => {
            return <ErrorListItem key={error} error={error} />;
          })}
        </StyledErrorList>
      </StyledScrollContainer>
      <OverlayActionButton onClick={handleClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};
