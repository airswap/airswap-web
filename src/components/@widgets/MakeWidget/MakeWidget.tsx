import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { compressFullOrderERC20, ADDRESS_ZERO } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import nativeCurrency, {
  nativeCurrencySafeTransactionFee,
} from "../../../constants/nativeCurrency";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { AppErrorType } from "../../../errors/appError";
import { selectBalances } from "../../../features/balances/balancesSlice";
import { fetchIndexerUrls } from "../../../features/indexer/indexerActions";
import { selectIndexerReducer } from "../../../features/indexer/indexerSlice";
import { createOtcOrder } from "../../../features/makeOtc/makeOtcActions";
import {
  clearLastUserOrder,
  reset,
  selectMakeOtcReducer,
  setError,
} from "../../../features/makeOtc/makeOtcSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
  selectProtocolFee,
} from "../../../features/metadata/metadataSlice";
import { approve, deposit } from "../../../features/orders/ordersActions";
import { selectOrdersStatus } from "../../../features/orders/ordersSlice";
import {
  selectUserTokens,
  setUserTokens,
} from "../../../features/userSettings/userSettingsSlice";
import getWethAddress from "../../../helpers/getWethAddress";
import switchToDefaultChain from "../../../helpers/switchToDefaultChain";
import toMaxAllowedDecimalsNumberString from "../../../helpers/toMaxAllowedDecimalsNumberString";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import useAllowance from "../../../hooks/useAllowance";
import useAllowancesOrBalancesFailed from "../../../hooks/useAllowancesOrBalancesFailed";
import useApprovalPending from "../../../hooks/useApprovalPending";
import { useBalanceLoading } from "../../../hooks/useBalanceLoading";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useMaxAmount from "../../../hooks/useMaxAmount";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useNetworkSupported from "../../../hooks/useNetworkSupported";
import useShouldDepositNativeToken from "../../../hooks/useShouldDepositNativeTokenAmount";
import useTokenInfo from "../../../hooks/useTokenInfo";
import useValidAddress from "../../../hooks/useValidAddress";
import { AppRoutes } from "../../../routes";
import { OrderScopeType, OrderType } from "../../../types/orderTypes";
import { TokenSelectModalTypes } from "../../../types/tokenSelectModalTypes";
import ApproveReview from "../../@reviewScreens/ApproveReview/ApproveReview";
import MakeOrderReview from "../../@reviewScreens/MakeOrderReview/MakeOrderReview";
import WrapReview from "../../@reviewScreens/WrapReview/WrapReview";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import DepositSubmittedScreen from "../../DepositSubmittedScreen/DepositSubmittedScreen";
import { SelectOption } from "../../Dropdown/Dropdown";
import OrderTypesModal from "../../InformationModals/subcomponents/OrderTypesModal/OrderTypesModal";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import ProtocolFeeOverlay from "../../ProtocolFeeOverlay/ProtocolFeeOverlay";
import { notifyOrderCreated } from "../../Toasts/ToastController";
import TokenList from "../../TokenList/TokenList";
import TransactionOverlay from "../../TransactionOverlay/TransactionOverlay";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import {
  Container,
  OrderTypeSelectorAndExpirySelectorWrapper,
  StyledActionButtons,
  StyledAddressInput,
  StyledExpirySelector,
  StyledInfoSection,
  StyledOrderTypeSelector,
  StyledSwapInputs,
  StyledTooltip,
  TooltipContainer,
} from "./MakeWidget.styles";
import { getNewTokenPair } from "./helpers";
import useOrderTypeSelectOptions from "./hooks/useOrderTypeSelectOptions";
import { ButtonActions } from "./subcomponents/ActionButtons/ActionButtons";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";

export enum MakeWidgetState {
  list = "list",
  review = "review",
}

const MakeWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const userTokens = useAppSelector(selectUserTokens);
  const protocolFee = useAppSelector(selectProtocolFee);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);
  const {
    status: makeOtcStatus,
    error,
    lastUserOrder,
  } = useAppSelector(selectMakeOtcReducer);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, chainId, account } = useAppSelector((state) => state.web3);

  // Input options
  const orderTypeSelectOptions = useOrderTypeSelectOptions();

  // User input states
  const [state, setState] = useState<MakeWidgetState>(MakeWidgetState.list);
  const [expiry, setExpiry] = useState(new Date().getTime());
  const [orderType, setOrderType] = useState<OrderType>(OrderType.publicListed);
  const [orderScopeTypeOption, setOrderScopeTypeOption] =
    useState<SelectOption>(orderTypeSelectOptions[0]);
  const [takerAddress, setTakerAddress] = useState("");
  const [makerAmount, setMakerAmount] = useState("");
  const [takerAmount, setTakerAmount] = useState("");

  // States derived from user input
  const defaultTokenToAddress = nativeCurrency[chainId!]?.address;
  const makerTokenInfo = useTokenInfo(userTokens.tokenFrom || null);
  const takerTokenInfo = useTokenInfo(
    userTokens.tokenTo || defaultTokenToAddress || null
  );
  const makerAmountPlusFee = useMemo(() => {
    return new BigNumber(makerAmount)
      .multipliedBy(1 + protocolFee / 10000)
      .toString();
  }, [makerAmount, protocolFee]);

  const { hasSufficientAllowance, readableAllowance } = useAllowance(
    makerTokenInfo,
    makerAmountPlusFee,
    true
  );
  const hasInsufficientBalance = useInsufficientBalance(
    makerTokenInfo,
    makerAmount,
    true
  );
  const isBalanceLoading = useBalanceLoading();
  const hasMissingMakerAmount =
    !makerAmount.length || parseFloat(makerAmount) === 0 || makerAmount === ".";
  const hasMissingTakerAmount =
    !takerAmount.length || parseFloat(takerAmount) === 0 || takerAmount === ".";
  const maxAmount = useMaxAmount(makerTokenInfo?.address || null, true);
  const showMaxButton = !!maxAmount && makerAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    makerTokenInfo?.address === ADDRESS_ZERO &&
    !!nativeCurrencySafeTransactionFee[makerTokenInfo.chainId];
  const approvalTransaction = useApprovalPending(makerTokenInfo?.address, true);
  const depositTransaction = useDepositPending();
  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    makerTokenInfo?.address,
    makerAmount
  );
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const isValidAddress = useValidAddress(takerAddress);
  const isAllowancesOrBalancesFailed = useAllowancesOrBalancesFailed();
  const isNetworkSupported = useNetworkSupported();

  // Modal states
  const { setShowWalletList, transactionsTabIsOpen } =
    useContext(InterfaceContext);
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const [showTokenSelectModal, setShowTokenSelectModal] =
    useState<TokenSelectModalTypes>(null);

  // useEffects
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (transactionsTabIsOpen) {
      setShowTokenSelectModal(null);
    }
  }, [transactionsTabIsOpen]);

  useEffect(() => {
    if (library) {
      dispatch(fetchIndexerUrls({ provider: library }));
    }
  }, [library]);

  useEffect(() => {
    if (orderScopeTypeOption.value === OrderScopeType.private) {
      return setOrderType(OrderType.private);
    }

    return setOrderType(OrderType.publicListed);
  }, [orderScopeTypeOption]);

  useEffect(() => {
    if (lastUserOrder) {
      const compressedOrder = compressFullOrderERC20(lastUserOrder);
      dispatch(clearLastUserOrder());
      history.push({ pathname: `/${AppRoutes.order}/${compressedOrder}` });

      notifyOrderCreated(lastUserOrder);
    }
  }, [lastUserOrder, history, dispatch]);

  useEffect(() => {
    if (!isActive) {
      setShowTokenSelectModal(null);
    }
  }, [isActive]);

  // Event handlers
  const handleOrderTypeCheckboxChange = (isChecked: boolean) => {
    setOrderType(isChecked ? OrderType.publicListed : OrderType.publicUnlisted);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    const { tokenFrom, tokenTo } = getNewTokenPair(
      type,
      value,
      userTokens.tokenTo || defaultTokenToAddress || undefined,
      userTokens.tokenFrom || undefined
    );

    dispatch(
      setUserTokens({
        tokenFrom,
        tokenTo,
      })
    );
  };

  const handleMakerAmountChange = (amount: string) => {
    setMakerAmount(
      toMaxAllowedDecimalsNumberString(amount, makerTokenInfo?.decimals)
    );
  };

  const handleTakerAmountChange = (amount: string) => {
    setTakerAmount(
      toMaxAllowedDecimalsNumberString(amount, takerTokenInfo?.decimals)
    );
  };

  const handleSwitchTokensButtonClick = () => {
    handleSetToken("base", userTokens.tokenTo || defaultTokenToAddress);
    setMakerAmount(takerAmount);
    setTakerAmount(makerAmount);
  };

  const reviewOrder = () => {
    if (orderType === OrderType.private && !isValidAddress) {
      dispatch(setError({ type: AppErrorType.invalidAddress }));

      return;
    }

    const formattedMakerAmount = toRoundedNumberString(
      makerAmount,
      makerTokenInfo?.decimals
    );
    const formattedTakerAmount = toRoundedNumberString(
      takerAmount,
      takerTokenInfo?.decimals
    );

    setMakerAmount(formattedMakerAmount);
    setTakerAmount(formattedTakerAmount);

    setState(MakeWidgetState.review);
  };

  const createOrder = () => {
    const expiryDate = Date.now() + expiry;
    const makerTokenAddress = makerTokenInfo?.address!;
    const takerTokenAddress = takerTokenInfo?.address!;

    const signerToken =
      makerTokenAddress === ADDRESS_ZERO
        ? getWethAddress(chainId!)
        : makerTokenAddress;
    const senderToken =
      takerTokenAddress === ADDRESS_ZERO
        ? getWethAddress(chainId!)
        : takerTokenAddress;

    dispatch(
      createOtcOrder({
        nonce: expiryDate.toString(),
        expiry: Math.floor(expiryDate / 1000).toString(),
        signerWallet: account!,
        signerToken,
        signerTokenInfo: makerTokenInfo!,
        signerAmount: makerAmount,
        protocolFee: protocolFee.toString(),
        senderWallet:
          orderType === OrderType.private ? takerAddress! : ADDRESS_ZERO,
        senderToken,
        senderTokenInfo: takerTokenInfo!,
        senderAmount: takerAmount,
        chainId: chainId!,
        library: library!,
        activeIndexers: indexerUrls,
        shouldSendToIndexers: orderType === OrderType.publicListed,
      })
    );
  };

  const approveToken = () => {
    const justifiedToken =
      makerTokenInfo?.address === ADDRESS_ZERO
        ? wrappedNativeToken
        : makerTokenInfo;

    dispatch(approve(makerAmountPlusFee, justifiedToken!, library!, "Swap"));
  };

  const depositNativeToken = async () => {
    dispatch(
      deposit(
        shouldDepositNativeTokenAmount!,
        makerTokenInfo!,
        wrappedNativeToken!,
        chainId!,
        library!
      )
    );
  };

  const handleEditButtonClick = () => {
    setState(MakeWidgetState.list);
  };

  const restart = () => {
    setState(MakeWidgetState.list);
    dispatch(reset());
  };

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToDefaultChain();
    }

    if (action === ButtonActions.review) {
      reviewOrder();
    }

    if (action === ButtonActions.restart) {
      restart();
    }
  };

  const handleBackButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.restart) {
      restart();
    }

    if (action === ButtonActions.goBack) {
      history.goBack();
    }
  };

  const handleAddressInputChange = (value: string) => {
    setTakerAddress(value);
    if (error?.type === AppErrorType.invalidAddress) {
      dispatch(setError(undefined));
    }
  };

  const renderScreens = () => {
    if (state === MakeWidgetState.review && shouldDepositNativeToken) {
      return (
        <>
          <WrapReview
            hasEditButton
            isLoading={!!depositTransaction}
            amount={makerAmount}
            amountPlusFee={makerAmountPlusFee}
            shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={handleEditButtonClick}
            onRestartButtonClick={restart}
            onSignButtonClick={depositNativeToken}
          />
        </>
      );
    }

    if (
      (state === MakeWidgetState.review && !hasSufficientAllowance) ||
      !!approvalTransaction
    ) {
      return (
        <>
          <ApproveReview
            hasEditButton
            isLoading={!!approvalTransaction}
            amount={makerAmount}
            amountPlusFee={makerAmountPlusFee}
            readableAllowance={readableAllowance}
            token={makerTokenInfo}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={handleEditButtonClick}
            onRestartButtonClick={restart}
            onSignButtonClick={approveToken}
          />
        </>
      );
    }

    if (state === MakeWidgetState.review) {
      return (
        <>
          <MakeOrderReview
            chainId={chainId}
            expiry={expiry}
            orderType={orderType}
            senderAddress={takerAddress}
            senderAmount={takerAmount}
            senderToken={takerTokenInfo}
            signerAmount={makerAmount}
            signerAmountPlusFee={makerAmountPlusFee}
            signerToken={makerTokenInfo}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={handleEditButtonClick}
            onSignButtonClick={createOrder}
          />
        </>
      );
    }

    return (
      <>
        <MakeWidgetHeader />

        <StyledSwapInputs
          canSetQuoteAmount
          disabled={!isActive || isAllowancesOrBalancesFailed}
          readOnly={!isActive || !isNetworkSupported}
          showMaxButton={showMaxButton}
          showMaxInfoButton={showMaxInfoButton}
          baseAmount={makerAmount}
          baseTokenInfo={makerTokenInfo}
          maxAmount={maxAmount}
          side="sell"
          quoteAmount={takerAmount}
          quoteTokenInfo={takerTokenInfo}
          onBaseAmountChange={handleMakerAmountChange}
          onChangeTokenClick={setShowTokenSelectModal}
          onMaxButtonClick={() => handleMakerAmountChange(maxAmount || "0")}
          onQuoteAmountChange={handleTakerAmountChange}
          onSwitchTokensButtonClick={handleSwitchTokensButtonClick}
        />
        <OrderTypeSelectorAndExpirySelectorWrapper>
          <StyledOrderTypeSelector
            isDisabled={!isActive}
            options={orderTypeSelectOptions}
            selectedOrderTypeOption={orderScopeTypeOption}
            onChange={setOrderScopeTypeOption}
          />

          <StyledExpirySelector
            isDisabled={!isActive}
            onChange={setExpiry}
            hideExpirySelector={!!showTokenSelectModal}
          />
        </OrderTypeSelectorAndExpirySelectorWrapper>

        {orderType === OrderType.private && (
          <TooltipContainer>
            <StyledAddressInput
              hasError={!!error}
              value={takerAddress}
              onChange={handleAddressInputChange}
              onInfoButtonClick={toggleShowOrderTypeInfo}
            />

            {error && (
              <StyledTooltip>
                {t("validatorErrors.invalidAddress", {
                  address: takerAddress,
                })}
              </StyledTooltip>
            )}
          </TooltipContainer>
        )}

        <StyledInfoSection
          isAllowancesFailed={isAllowancesOrBalancesFailed}
          isNetworkUnsupported={isActive && !isNetworkSupported}
        />

        <StyledActionButtons
          hasInsufficientExpiry={expiry === 0}
          hasInsufficientAllowance={!hasSufficientAllowance}
          hasInsufficientBalance={
            hasInsufficientBalance && !shouldDepositNativeToken
          }
          hasMissingMakerAmount={hasMissingMakerAmount}
          hasMissingMakerToken={!makerTokenInfo}
          hasMissingTakerAmount={hasMissingTakerAmount}
          hasMissingTakerToken={!takerTokenInfo}
          isLoading={isBalanceLoading}
          isNetworkUnsupported={!isNetworkSupported}
          shouldDepositNativeToken={shouldDepositNativeToken}
          shouldRefresh={isAllowancesOrBalancesFailed}
          walletIsNotConnected={!isActive}
          makerTokenSymbol={makerTokenInfo?.symbol}
          onBackButtonClick={handleBackButtonClick}
          onActionButtonClick={handleActionButtonClick}
        />
      </>
    );
  };

  return (
    <Container>
      {renderScreens()}

      <TransactionOverlay
        isHidden={ordersStatus !== "signing" && makeOtcStatus !== "signing"}
      >
        <WalletSignScreen type="signature" />
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

      <ModalOverlay
        hasDynamicHeight
        onClose={() => setShowTokenSelectModal(null)}
        title={t("common.selectToken")}
        isHidden={!showTokenSelectModal}
      >
        <TokenList
          activeTokens={activeTokens}
          allTokens={allTokens}
          balances={balances}
          supportedTokenAddresses={[]}
          onSelectToken={(newTokenAddress) => {
            handleSetToken(showTokenSelectModal, newTokenAddress);
            setShowTokenSelectModal(null);
          }}
        />
      </ModalOverlay>
      <ModalOverlay
        title={t("information.counterParty.title")}
        onClose={() => toggleShowOrderTypeInfo(false)}
        isHidden={!showOrderTypeInfo}
      >
        <OrderTypesModal onCloseButtonClick={() => toggleShowOrderTypeInfo()} />
      </ModalOverlay>
      <ProtocolFeeOverlay
        isHidden={showFeeInfo}
        onCloseButtonClick={() => toggleShowFeeInfo(false)}
      />
    </Container>
  );
};

export default MakeWidget;
