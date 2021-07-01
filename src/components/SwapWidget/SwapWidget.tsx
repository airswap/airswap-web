import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { toDecimalString } from "@airswap/utils";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  SubmittedApproval,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";
import {
  approve,
  request,
  take,
  selectBestOrder,
  selectOrdersStatus,
} from "../../features/orders/ordersSlice";
import { selectActiveTokens } from "../../features/metadata/metadataSlice";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import Card from '../Card/Card';
import TokenSelect from '../TokenSelect/TokenSelect';
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Button from '../Button/Button';
import Timer from "../../components/Timer/Timer";
import Modal from "react-modal";
import WalletProviderList from '../WalletProviderList/WalletProviderList';

const SwapWidget = () => {
    const [senderToken, setSenderToken] = useState<string>();
    const [signerToken, setSignerToken] = useState<string>();
    const [senderAmount, setSenderAmount] = useState("0.01");
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [showWalletList, setShowWalletList] = useState<boolean>(false);
    const transactions = useAppSelector(selectTransactions);
    const order = useAppSelector(selectBestOrder);
    const ordersStatus = useAppSelector(selectOrdersStatus);
    const dispatch = useAppDispatch();
    const activeTokens = useAppSelector(selectActiveTokens);  
    const { t } = useTranslation(["orders", "common", "wallet"]);
    const { chainId, account, library, active } = useWeb3React<Web3Provider>();
    const { trackEvent } = useMatomo();

    let signerAmount: string | null = null;
    if (order) {
        signerAmount = toDecimalString(order.signerAmount, 18);
    }

    const getTokenApprovalStatus = (tokenId: string | undefined) => {
      if (tokenId === undefined) return null;
      for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type === "Approval") {
          const approvalTx: SubmittedApproval = transactions[
            i
          ] as SubmittedApproval;
          if (approvalTx.tokenAddress === tokenId) return approvalTx.status;
        }
      }
      return null;
    };

    const DisplayedButton = () => {
      if (!active || !chainId) {
        return (
          <Button
            className="w-full mt-2"
            intent="primary"
            disabled={!senderToken || !signerToken || !senderAmount}
            loading={isConnecting}
            onClick={() => setShowWalletList(true)}
          >
          {t("wallet:connectWallet")}
        </Button>
        )
      } else if (
        signerAmount && 
        getTokenApprovalStatus(senderToken) === "succeeded" &&
        signerToken && 
        senderToken
        ) {
        return (
          <Button
            className="w-full mt-2"
            intent="primary"
            aria-label={t("orders:take", { context: "aria" })}
            loading={ordersStatus === "taking"}
            onClick={async () => dispatch(take({ order, library }))}
          >
            {t("orders:take")}
          </Button>
        )
      } else if (
        signerAmount &&
        signerToken &&
        senderToken
      ) {
        return (
          <Button
            className="w-full mt-2"
            intent="primary"
            aria-label={t("orders:approve", { context: "aria" })}
            loading={getTokenApprovalStatus(senderToken) === "processing"}
            onClick={() => dispatch(approve({ token: senderToken, library }))}
          >
            {t("orders:approve")}
          </Button>
        )
      } else {
        return (
          <Button
            className="w-full mt-2"
            intent="primary"
            disabled={!senderToken || !signerToken || !senderAmount}
            loading={ordersStatus === "requesting"}
            onClick={() => {
              dispatch(
                request({
                  chainId: chainId!,
                  senderToken: senderToken!,
                  senderAmount,
                  signerToken: signerToken!,
                  senderWallet: account!,
                  provider: library,
                })
              );
              trackEvent({ category: "order", action: "request" });
            }}
          >
            {t("orders:request")}
          </Button>
        )
      }
    }

    return (
    <Card className="flex-col m-4 w-72">
      {!order ? 
        <h3 className="mb-4 font-bold">Swap now</h3> : 
        (<p className="mb-4">
            Quote expires in&nbsp;
            <Timer
              expiryTime={parseInt(order.expiry)}
              onTimerComplete={() => {
                dispatch(
                  request({
                    chainId: chainId!,
                    senderToken: senderToken!,
                    senderAmount,
                    signerToken: signerToken!,
                    senderWallet: account!,
                    provider: library,
                  })
                );
                trackEvent({ category: "order", action: "request" });
              }}
            />
        </p>)
      }
      <TokenSelect
        tokens={activeTokens}
        withAmount={true}
        amount={senderAmount}
        onAmountChange={(e) => setSenderAmount(e.currentTarget.value)}
        className="mb-2"
        label={t("orders:send")}
        token={senderToken}
        onTokenChange={(e) => setSenderToken(e.currentTarget.value)}
      />
      <TokenSelect
        tokens={activeTokens}
        withAmount={false}
        className="mb-2"
        label={t("orders:receive")}
        token={signerToken}
        quoteAmount={signerAmount}
        onTokenChange={(e) => setSignerToken(e.currentTarget.value)}
      />
      {DisplayedButton()}
      <Modal
        isOpen={showWalletList}
        onRequestClose={() => setShowWalletList(false)}
        overlayClassName="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-10"
        className="w-64 p-4 rounded-sm bg-white dark:bg-gray-800 shadow-lg"
      >
        <WalletProviderList 
          onProviderSelected={(provider) => {
            
          }}
        />

      </Modal>
    </Card>
    )

}

export default SwapWidget;