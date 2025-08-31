import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { CompactActionButton } from "../../styled-components/CompactActionButton/CompactActionButton";
import { Notice } from "../Notice/Notice";
import { ButtonsContainer } from "./OverwriteLimitOrderNotice.styles";

type OverwriteLimitOrderNoticeProps = {
  className?: string;
};

export const OverwriteLimitOrderNotice: FC<OverwriteLimitOrderNoticeProps> = ({
  className,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const { t } = useTranslation();

  const handleDismissButtonClick = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  return (
    <Notice
      className={className}
      text={
        <>
          {t("orders.overwriteLimitOrderWarning")}{" "}
          <ButtonsContainer>
            <CompactActionButton onClick={handleDismissButtonClick}>
              {t("orders.dismiss")}
            </CompactActionButton>
          </ButtonsContainer>
        </>
      }
    />
  );
};
