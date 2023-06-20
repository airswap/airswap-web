import React from "react";
import { useTranslation } from "react-i18next";

import { getReceiptUrl } from "@airswap/utils";

import Icon from "../../../Icon/Icon";
import { Container, Link, IconContainer } from "./BlockExplorerLink.styles";
import { SubmittedTransaction } from "../../../../features/transactions/transactionsSlice";

type BlockEplorerLinkProps = {
  chainId: number;
  transaction: SubmittedTransaction | undefined
  className?: string;
};

const BlockExplorerLink = ({
  chainId,
  transaction,
  className = "",
}: BlockEplorerLinkProps) => {
  const { t } = useTranslation();
  const transactionHash = transaction?.hash || ""
  return (
    <>
      <Container>
        <Link
          className={className}
          target="_blank"
          rel="noreferrer"
          aria-label={t("orders.transactionLink")}
          href={`${getReceiptUrl(chainId, transactionHash)}`}
        >
          {t("orders.transactionLink")}
        </Link>
        <Link
          className={className}
          target="_blank"
          rel="noreferrer"
          aria-label={t("orders.transactionLink")}
          href={`${getReceiptUrl(chainId, transactionHash)}`}
        >
          <IconContainer>
            <Icon iconSize={1} name="transaction-link" />
          </IconContainer>
        </Link>
      </Container>
    </>
  );
};

export default BlockExplorerLink;
