import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import Link from "../../../../styled-components/Link/Link.styles";
import { ModalParagraph } from "../../../../styled-components/Modal/Modal";
import { OverlayActionLink } from "../../../Overlay/Overlay.styles";
import { Container } from "./ProtocolFeeDiscountModal.styles";

const ProtocolFeeDiscountModal: FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <ModalParagraph>
        {t("information.protocolFeeDiscount.paragraph")}
      </ModalParagraph>
      <ModalParagraph>
        {`${t("information.protocolFeeDiscount.paragraph2")} `}
        <Link
          target="_blank"
          href="https://etherscan.io/address/0x7296333e1615721f4bd9df1a3070537484a50cf8"
        >
          {t("information.protocolFeeDiscount.link")}
        </Link>
        .
      </ModalParagraph>
      <OverlayActionLink
        target="_blank"
        href="https://activate.codefi.network/staking/airswap/governance"
      >
        {t("information.protocolFeeDiscount.stakeYourAst")}
      </OverlayActionLink>
    </Container>
  );
};

export default ProtocolFeeDiscountModal;
