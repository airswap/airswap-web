import { FC, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import {
  FullOrderERC20,
  ADDRESS_ZERO,
  TokenInfo,
  FullOrder,
  TokenKinds,
  OrderERC20,
  getTokenKind,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import {
  getTokenDecimals,
  getTokenSymbol,
  isTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import {
  checkFullOrder,
  isFullOrder,
} from "../../../entities/FullOrder/FullOrderHelpers";
import {
  fetchIndexerUrls,
  getFilteredOrders,
} from "../../../features/indexer/indexerActions";
import { selectIndexerReducer } from "../../../features/indexer/indexerSlice";
import {
  approve,
  deposit,
  takeErc20,
  takeFullOrder,
} from "../../../features/orders/ordersActions";
import { checkOrderErc20 } from "../../../features/orders/ordersHelpers";
import {
  clear,
  selectOrdersErrors,
  selectOrdersStatus,
} from "../../../features/orders/ordersSlice";
import {
  reset,
  selectTakeOtcErrors,
  setErrors,
} from "../../../features/takeOtc/takeOtcSlice";
import { compareAddresses } from "../../../helpers/string";
import useAllowance from "../../../hooks/useAllowance";
import useAllowancesOrBalancesFailed from "../../../hooks/useAllowancesOrBalancesFailed";
import { useAmountPlusFee } from "../../../hooks/useAmountPlusFee";
import useApprovalPending from "../../../hooks/useApprovalPending";
import { useBalanceLoading } from "../../../hooks/useBalanceLoading";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useOrderTransactionLink from "../../../hooks/useOrderTransactionLink";
import useShouldDepositNativeToken from "../../../hooks/useShouldDepositNativeTokenAmount";
import { AppRoutes, routes } from "../../../routes";
import { OrderStatus } from "../../../types/orderStatus";
import { OrderType } from "../../../types/orderTypes";
import { TransactionStatusType } from "../../../types/transactionTypes";
import TakeOrderReview from "../../@reviewScreens/TakeOrderReview/TakeOrderReview";
import WrapReview from "../../@reviewScreens/WrapReview/WrapReview";
import { ApprovalNotice } from "../../ApprovalNotice/ApprovalNotice";
import { useShouldShowApprovalNotice } from "../../ApprovalNotice/hooks/useShouldShowApprovalNotice";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import AvailableOrdersWidget from "../../AvailableOrdersWidget/AvailableOrdersWidget";
import addAndSwitchToChain from "../../ChainSelectionPopover/helpers/addAndSwitchToChain";
import DepositSubmittedScreen from "../../DepositSubmittedScreen/DepositSubmittedScreen";
import { ErrorList } from "../../ErrorList/ErrorList";
import ProtocolFeeModal from "../../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import OrderSubmittedScreen from "../../OrderSubmittedScreen/OrderSubmittedScreen";
import SwapInputs from "../../SwapInputs/SwapInputs";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  StyledActionButtons,
  StyledInfoSection,
  StyledRecipientAndStatus,
} from "../OrderDetailWidget/OrderDetailWidget.styles";
import useFormattedTokenAmount from "../OrderDetailWidget/hooks/useFormattedTokenAmount";
import useTakerTokenInfo from "../OrderDetailWidget/hooks/useTakerTokenInfo";
import { ButtonActions } from "../OrderDetailWidget/subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "../OrderDetailWidget/subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";
import { useOtcOrderStatus } from "./hooks/useOtcOrderStatus";
import useSessionOrderTransaction from "./hooks/useSessionOrderTransaction";

interface OtcOrderDetailWidgetProps {
  order: FullOrder | FullOrderERC20;
}

export enum OtcOrderDetailWidgetState {
  overview = "overview",
  review = "review",
}

const OtcOrderDetailWidget: FC<OtcOrderDetailWidgetProps> = ({ order }) => {
  const { t } = useTranslation();
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, account, chainId } = useAppSelector((state) => state.web3);

  const history = useHistory();
  const dispatch = useAppDispatch();
  const params = useParams<{ compressedOrder: string }>();
  const { setShowWalletList, setTransactionsTabIsOpen } =
    useContext(InterfaceContext);

  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const takeOtcErrors = useAppSelector(selectTakeOtcErrors);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);

  const errors = [...ordersErrors, ...takeOtcErrors];

  const [state, setState] = useState<OtcOrderDetailWidgetState>(
    OtcOrderDetailWidgetState.overview
  );
  const [hideTransactionOverlay, setHideTransactionOverlay] = useState(false);

  const senderWallet = isFullOrder(order)
    ? order.sender.wallet
    : order.senderWallet;
  const senderTokenAddress = isFullOrder(order)
    ? order.sender.token
    : order.senderToken;
  const senderTokenId = isFullOrder(order) ? order.sender.id : undefined;
  const senderTokenAmount = isFullOrder(order)
    ? order.sender.amount
    : order.senderAmount;

  const signerWallet = isFullOrder(order)
    ? order.signer.wallet
    : order.signerWallet;
  const signerTokenAddress = isFullOrder(order)
    ? order.signer.token
    : order.signerToken;
  const signerTokenId = isFullOrder(order) ? order.signer.id : undefined;
  const signerTokenAmount = isFullOrder(order)
    ? order.signer.amount
    : order.signerAmount;
  const signerTokenKind = isFullOrder(order)
    ? (order.signer.kind as TokenKinds)
    : TokenKinds.ERC20;

  const [orderStatus, isOrderStatusLoading] = useOtcOrderStatus(order);
  const [senderToken, isSenderTokenLoading] = useTakerTokenInfo({
    address: senderTokenAddress,
    chainId: order.chainId,
    tokenId: senderTokenId,
  });
  const [signerToken, isSignerTokenLoading] = useTakerTokenInfo({
    address: signerTokenAddress,
    chainId: order.chainId,
    tokenId: signerTokenId,
    tokenKind: signerTokenKind,
  });
  const isBalanceLoading = useBalanceLoading();
  const senderTokenDecimals = senderToken
    ? getTokenDecimals(senderToken)
    : undefined;
  const signerTokenDecimals = signerToken
    ? getTokenDecimals(signerToken)
    : undefined;
  const senderTokenSymbol = senderToken
    ? getTokenSymbol(senderToken)
    : undefined;
  const signerTokenSymbol = signerToken
    ? getTokenSymbol(signerToken)
    : undefined;
  const senderShouldPayProtocolFee = isFullOrder(order);

  const originalSenderAmount = useFormattedTokenAmount(
    senderTokenAmount,
    senderTokenDecimals
  );
  const senderAmountPlusFee = useAmountPlusFee(
    originalSenderAmount,
    senderTokenDecimals
  );
  const senderAmount = senderShouldPayProtocolFee
    ? senderAmountPlusFee
    : originalSenderAmount;
  const signerAmount = useFormattedTokenAmount(
    signerTokenKind !== TokenKinds.ERC721 ? signerTokenAmount : "1",
    signerTokenDecimals
  );
  const tokenExchangeRate = new BigNumber(senderAmount).dividedBy(
    signerAmount!
  );
  const senderTokenApprovalTransaction = useApprovalPending(
    senderTokenAddress,
    true
  );
  const signerTokenApprovalTransaction = useApprovalPending(
    signerTokenAddress,
    true
  );
  const approvalTransaction =
    senderTokenApprovalTransaction || signerTokenApprovalTransaction;
  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const orderTransaction = useSessionOrderTransaction(order.nonce);
  const signerShouldPayProtocolFee =
    !isFullOrder(order) && signerTokenKind === TokenKinds.ERC20;
  const signerAmountPlusFee = useAmountPlusFee(
    signerAmount,
    signerTokenDecimals
  );
  const { hasSufficientAllowance } = useAllowance(senderToken, senderAmount, {
    spenderAddressType: isFullOrder(order) ? "swap" : "swapERC20",
  });
  const { hasSufficientAllowance: signerHasSufficientAllowance } = useAllowance(
    signerToken,
    signerShouldPayProtocolFee ? signerAmountPlusFee : signerAmount,
    {
      spenderAddressType: isFullOrder(order) ? "swap" : "swapERC20",
    }
  );

  const hasInsufficientTokenBalance = useInsufficientBalance(
    senderToken,
    senderAmount
  );

  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    senderToken?.address,
    senderAmount
  );
  const isAllowancesOrBalancesFailed = useAllowancesOrBalancesFailed();
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const depositTransaction = useDepositPending(true);
  const orderTransactionLink = useOrderTransactionLink(order.nonce);
  const orderChainId = useMemo(() => order.chainId, [order]);
  const walletChainIdIsDifferentThanOrderChainId =
    !!chainId && orderChainId !== chainId;

  const orderType =
    senderWallet === ADDRESS_ZERO
      ? OrderType.publicUnlisted
      : OrderType.private;
  const userIsMakerOfSwap = compareAddresses(signerWallet, account || "");
  const userIsIntendedRecipient =
    compareAddresses(senderWallet, account || "") ||
    senderWallet === ADDRESS_ZERO;
  const shouldShowApprovalNotice =
    useShouldShowApprovalNotice({
      chainId,
      spenderAddressType: isFullOrder(order) ? "swap" : "swapERC20",
      tokenInfo: signerToken,
    }) && userIsMakerOfSwap;

  const parsedExpiry = useMemo(() => {
    return new Date(parseInt(order.expiry) * 1000);
  }, [order]);

  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const [showViewAllQuotes, toggleShowViewAllQuotes] = useToggle(false);

  useEffect(() => {
    if (!indexerUrls && library) {
      dispatch(fetchIndexerUrls({ provider: library }));
    }
  }, [indexerUrls]);

  useEffect(() => {
    if (indexerUrls && senderToken && signerToken) {
      dispatch(
        getFilteredOrders({
          filter: {
            senderToken: senderToken.address,
            signerToken: signerToken.address,
          },
        })
      );
    }
  }, [indexerUrls, senderToken, signerToken]);

  useEffect(() => {
    if (depositTransaction?.status === TransactionStatusType.succeeded) {
      backToOverview();
    }
  }, [depositTransaction?.status]);

  // button handlers
  const backToSwapPage = () => {
    history.push({
      pathname: `/${AppRoutes.swap}/${senderToken?.address}/${signerToken?.address}`,
      state: { isFromOrderDetailPage: true },
    });
  };

  const takeOrder = async () => {
    if (!library || !account || !chainId) return;

    const errors = await (isFullOrder(order)
      ? checkFullOrder(order as FullOrder, senderWallet, library)
      : checkOrderErc20(order as OrderERC20, senderWallet, chainId, library));

    if (errors.length) {
      dispatch(setErrors(errors));
      return;
    }

    await dispatch(
      isFullOrder(order)
        ? takeFullOrder({
            order,
            senderWallet: account!,
            signerToken: signerToken!,
            senderToken: senderToken!,
            library,
          })
        : takeErc20(
            order,
            signerToken! as TokenInfo,
            senderToken! as TokenInfo,
            library,
            "SwapERC20"
          )
    );
  };

  const approveToken = () => {
    if (!senderToken || !senderAmount || !library) {
      return;
    }

    dispatch(
      approve(
        senderAmount,
        senderToken,
        library,
        isFullOrder(order) ? "Swap" : "SwapERC20"
      )
    );
  };

  const depositNativeToken = async () => {
    dispatch(
      deposit(
        shouldDepositNativeTokenAmount!,
        senderToken as TokenInfo,
        wrappedNativeToken!,
        chainId!,
        library!
      )
    );
  };

  const restart = () => {
    history.push({ pathname: `/${AppRoutes.makeOtcOrder}` });
    dispatch(clear());
    dispatch(reset());
  };

  const backToOverview = () => {
    setState(OtcOrderDetailWidgetState.overview);
  };

  const returnToOrder = () => {
    setState(OtcOrderDetailWidgetState.overview);
    setHideTransactionOverlay(true);
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      addAndSwitchToChain(order.chainId);
    }

    if (action === ButtonActions.restart) {
      restart();
    }

    if (action === ButtonActions.approve) {
      approveToken();
    }

    if (action === ButtonActions.review) {
      setState(OtcOrderDetailWidgetState.review);
    }

    if (action === ButtonActions.cancel) {
      history.push(routes.cancelOtcOrder(params.compressedOrder));
    }

    if (action === ButtonActions.take) {
      takeOrder();
    }

    if (
      action === ButtonActions.back ||
      action === ButtonActions.makeNewOrder
    ) {
      history.push(routes.makeOtcOrder());
    }
  };

  const renderScreens = () => {
    if (
      state === OtcOrderDetailWidgetState.review &&
      shouldDepositNativeToken &&
      !depositTransaction &&
      !orderTransaction
    ) {
      return (
        <WrapReview
          isLoading={!!depositTransaction}
          amount={senderAmount}
          errors={errors}
          shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
          wrappedNativeToken={wrappedNativeToken}
          onRestartButtonClick={backToOverview}
          onSignButtonClick={depositNativeToken}
        />
      );
    }

    if (state === OtcOrderDetailWidgetState.review) {
      return (
        <TakeOrderReview
          errors={errors}
          expiry={+order.expiry}
          senderAmount={originalSenderAmount}
          senderAmountPlusFee={
            senderShouldPayProtocolFee ? senderAmountPlusFee : undefined
          }
          senderToken={senderToken}
          signerAmount={signerAmount}
          signerToken={signerToken}
          wrappedNativeToken={wrappedNativeToken}
          onEditButtonClick={backToOverview}
          onRestartButtonClick={restart}
          onSignButtonClick={takeOrder}
        />
      );
    }

    return (
      <>
        <OrderDetailWidgetHeader isMakerOfSwap={userIsMakerOfSwap} />
        <SwapInputs
          readOnly
          disabled={orderStatus === OrderStatus.canceled}
          isRequestingBaseAmount={isSignerTokenLoading}
          isRequestingBaseToken={isSignerTokenLoading}
          isRequestingQuoteAmount={isSenderTokenLoading}
          isRequestingQuoteToken={isSenderTokenLoading}
          showTokenContractLink
          baseAmount={signerAmount}
          baseTokenInfo={signerToken}
          maxAmount={null}
          side={userIsMakerOfSwap ? "sell" : "buy"}
          tradeNotAllowed={walletChainIdIsDifferentThanOrderChainId}
          quoteAmount={senderAmount}
          quoteTokenInfo={senderToken}
          onBaseAmountChange={() => {}}
          onChangeTokenClick={() => {}}
          onMaxButtonClick={() => {}}
        />

        <StyledRecipientAndStatus
          isLoading={isOrderStatusLoading}
          expiry={parsedExpiry}
          link={orderTransactionLink}
          orderType={orderType}
          recipient={senderWallet}
          status={orderStatus}
          userAddress={account || undefined}
        />

        <StyledInfoSection
          isAllowancesFailed={isAllowancesOrBalancesFailed}
          isExpired={orderStatus === OrderStatus.expired}
          isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
          isIntendedRecipient={userIsIntendedRecipient}
          isMakerOfSwap={userIsMakerOfSwap}
          isNotConnected={!isActive}
          orderChainId={orderChainId}
          token1={signerTokenSymbol}
          token2={senderTokenSymbol}
          rate={tokenExchangeRate}
          onFeeButtonClick={toggleShowFeeInfo}
        />

        <StyledActionButtons
          hasInsufficientBalance={hasInsufficientTokenBalance}
          hasInsufficientAllowance={!hasSufficientAllowance}
          isExpired={orderStatus === OrderStatus.expired}
          isCanceled={orderStatus === OrderStatus.canceled}
          isTaken={orderStatus === OrderStatus.taken}
          isDifferentChainId={walletChainIdIsDifferentThanOrderChainId}
          isIntendedRecipient={userIsIntendedRecipient}
          isLoading={isBalanceLoading}
          isMakerOfSwap={userIsMakerOfSwap}
          isNotConnected={!isActive}
          requiresReload={isAllowancesOrBalancesFailed}
          shouldDepositNativeToken={shouldDepositNativeToken}
          onActionButtonClick={handleActionButtonClick}
        />

        {shouldShowApprovalNotice && (
          <ApprovalNotice
            makerDoesNotHaveEnoughAllowanceForActiveOrder={
              !signerHasSufficientAllowance
            }
            activeState="orderDetail"
            chainId={chainId}
            spenderAddressType={isFullOrder(order) ? "swap" : "swapERC20"}
            tokenInfo={signerToken}
          />
        )}
      </>
    );
  };

  return (
    <Container>
      {renderScreens()}

      <ModalOverlay
        title={t("information.protocolFee.title")}
        onClose={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <ProtocolFeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </ModalOverlay>

      <ModalOverlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onClose={restart}
        isHidden={!errors.length}
      >
        <ErrorList errors={errors} onBackButtonClick={restart} />
      </ModalOverlay>

      {signerToken && senderToken && (
        <ModalOverlay
          title={t("orders.availableOrders")}
          isHidden={!showViewAllQuotes}
          onClose={() => toggleShowViewAllQuotes()}
        >
          <AvailableOrdersWidget
            senderToken={senderToken}
            signerToken={signerToken}
            onSwapLinkClick={backToSwapPage}
            onFullOrderLinkClick={toggleShowViewAllQuotes}
          />
        </ModalOverlay>
      )}

      <TransactionOverlay isHidden={ordersStatus !== "signing"}>
        <WalletSignScreen type="swap" />
      </TransactionOverlay>

      <TransactionOverlay
        isHidden={ordersStatus === "signing" || !approvalTransaction}
      >
        {approvalTransaction && (
          <ApprovalSubmittedScreen
            chainId={chainId}
            transaction={approvalTransaction}
          />
        )}
      </TransactionOverlay>

      <TransactionOverlay
        isHidden={ordersStatus === "signing" || !depositTransaction}
      >
        {depositTransaction && (
          <DepositSubmittedScreen
            chainId={chainId}
            transaction={depositTransaction}
          />
        )}
      </TransactionOverlay>

      <TransactionOverlay
        isHidden={!orderTransaction || hideTransactionOverlay}
      >
        {orderTransaction && (
          <OrderSubmittedScreen
            showTrackTransactionButton
            showReturnToOrderButton
            chainId={chainId}
            transaction={orderTransaction}
            onMakeNewOrderButtonClick={restart}
            onReturnToOrderButtonClick={returnToOrder}
          />
        )}
      </TransactionOverlay>
    </Container>
  );
};

export default OtcOrderDetailWidget;
