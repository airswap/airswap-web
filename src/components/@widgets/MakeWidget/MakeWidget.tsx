import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useLocalStorage } from "react-use";

import {
  ADDRESS_ZERO,
  TokenInfo,
  TokenKinds,
  compressFullOrder,
  compressFullOrderERC20,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import nativeCurrency from "../../../constants/nativeCurrency";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenKind,
  getTokenSymbol,
  isCollectionTokenInfo,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../../../entities/FullOrder/FullOrderHelpers";
import { AppErrorType } from "../../../errors/appError";
import { selectBalances } from "../../../features/balances/balancesSlice";
import { fetchIndexerUrls } from "../../../features/indexer/indexerActions";
import { selectIndexerReducer } from "../../../features/indexer/indexerSlice";
import { createOtcOrDelegateOrder } from "../../../features/makeOrder/makeOrderActions";
import {
  clearLastUserOrder,
  reset,
  selectMakeOrderReducer,
  setError,
} from "../../../features/makeOrder/makeOrderSlice";
import {
  selectActiveErc20Tokens,
  selectActiveTokens,
  selectAllTokenInfo,
  selectErc20Tokens,
  selectProtocolFee,
} from "../../../features/metadata/metadataSlice";
import { approve, deposit } from "../../../features/orders/ordersActions";
import { selectOrdersStatus } from "../../../features/orders/ordersSlice";
import {
  selectUserTokens,
  setUserTokens,
  UserToken,
} from "../../../features/userSettings/userSettingsSlice";
import getWethAddress from "../../../helpers/getWethAddress";
import switchToDefaultChain from "../../../helpers/switchToDefaultChain";
import toMaxAllowedDecimalsNumberString from "../../../helpers/toMaxAllowedDecimalsNumberString";
import toRoundedNumberString from "../../../helpers/toRoundedNumberString";
import useAllowance from "../../../hooks/useAllowance";
import useAllowancesOrBalancesFailed from "../../../hooks/useAllowancesOrBalancesFailed";
import { useAmountPlusFee } from "../../../hooks/useAmountPlusFee";
import useApprovalPending from "../../../hooks/useApprovalPending";
import { useBalanceLoading } from "../../../hooks/useBalanceLoading";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useMaxAmount from "../../../hooks/useMaxAmount";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useNetworkSupported from "../../../hooks/useNetworkSupported";
import useSetRuleTransaction from "../../../hooks/useSetRuleTransaction";
import useShouldDepositNativeToken from "../../../hooks/useShouldDepositNativeTokenAmount";
import useTokenInfo from "../../../hooks/useTokenInfo";
import useValidAddress from "../../../hooks/useValidAddress";
import { routes } from "../../../routes";
import { OrderScopeType, OrderType } from "../../../types/orderTypes";
import { TokenSelectModalTypes } from "../../../types/tokenSelectModalTypes";
import ApproveReview from "../../@reviewScreens/ApproveReview/ApproveReview";
import MakeOrderReview from "../../@reviewScreens/MakeOrderReview/MakeOrderReview";
import WrapReview from "../../@reviewScreens/WrapReview/WrapReview";
import { ApprovalNotice } from "../../ApprovalNotice/ApprovalNotice";
import { useShouldShowApprovalNotice } from "../../ApprovalNotice/hooks/useShouldShowApprovalNotice";
import ApprovalSubmittedScreen from "../../ApprovalSubmittedScreen/ApprovalSubmittedScreen";
import DepositSubmittedScreen from "../../DepositSubmittedScreen/DepositSubmittedScreen";
import { SelectOption } from "../../Dropdown/Dropdown";
import OrderTypesModal from "../../InformationModals/subcomponents/OrderTypesModal/OrderTypesModal";
import ModalOverlay from "../../ModalOverlay/ModalOverlay";
import { OverwriteLimitOrderNotice } from "../../OverwriteLimitOrderNotice/OverwriteLimitOrderNotice";
import { useShouldShowOverwriteLimitOrderNotice } from "../../OverwriteLimitOrderNotice/hooks/useShouldShowOverwriteLimitOrderNotice";
import ProtocolFeeOverlay from "../../ProtocolFeeOverlay/ProtocolFeeOverlay";
import SetRuleSubmittedScreen from "../../SetRuleSubmittedScreen/SetRuleSubmittedScreen";
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
  StyledNotice,
  StyledOrderTypeSelector,
  StyledSwapInputs,
  StyledTooltip,
  TooltipContainer,
} from "./MakeWidget.styles";
import { getNewTokenPair } from "./helpers";
import useOrderTypeSelectOptions from "./hooks/useOrderTypeSelectOptions";
import { ButtonActions } from "./subcomponents/ActionButtons/ActionButtons";

export enum MakeWidgetState {
  list = "list",
  review = "review",
}

interface MakeWidgetProps {
  isLimitOrder?: boolean;
}

const MakeWidget: FC<MakeWidgetProps> = ({ isLimitOrder = false }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const activeErc20Tokens = useAppSelector(selectActiveErc20Tokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const erc20Tokens = useAppSelector(selectErc20Tokens);
  const userTokens = useAppSelector(selectUserTokens);
  const protocolFee = useAppSelector(selectProtocolFee);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);
  const {
    status: makeOtcStatus,
    error,
    lastDelegateRule,
    lastOtcOrder: lastUserOrder,
  } = useAppSelector(selectMakeOrderReducer);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const { provider: library } = useWeb3React<Web3Provider>();
  const { isActive, chainId, account } = useAppSelector((state) => state.web3);
  const [showLimitNotice, setShowLimitNotice] = useLocalStorage(
    "showLimitNotice",
    true
  );
  const orderTypeSelectOptions = useOrderTypeSelectOptions();

  // Selected tokens
  const defaultTokenToAddress = nativeCurrency[chainId!]?.address;
  const makerTokenInfo = useTokenInfo(
    userTokens.tokenFrom?.address,
    userTokens.tokenFrom?.tokenId
  );
  const takerTokenInfo = useTokenInfo(
    userTokens.tokenTo?.address || defaultTokenToAddress,
    userTokens.tokenTo?.tokenId
  );
  const makerTokenDecimals = makerTokenInfo
    ? getTokenDecimals(makerTokenInfo)
    : undefined;
  const takerTokenDecimals = takerTokenInfo
    ? getTokenDecimals(takerTokenInfo)
    : undefined;
  const makerTokenSymbol = makerTokenInfo
    ? getTokenSymbol(makerTokenInfo)
    : undefined;
  const makerTokenKind = makerTokenInfo
    ? getTokenKind(makerTokenInfo)
    : undefined;
  const takerTokenKind = takerTokenInfo
    ? getTokenKind(takerTokenInfo)
    : undefined;

  // NFT's are not supported for limit orders
  const isNftSupported = !isLimitOrder;
  const signerShouldPayProtocolFee =
    !isLimitOrder && makerTokenKind === TokenKinds.ERC20;
  const defaultMakerAmount =
    isNftSupported && makerTokenKind === TokenKinds.ERC721 ? "1" : "";

  // User input states
  const [state, setState] = useState<MakeWidgetState>(MakeWidgetState.list);
  const [expiry, setExpiry] = useState(new Date().getTime());
  const [orderType, setOrderType] = useState<OrderType>(OrderType.publicListed);
  const [orderScopeTypeOption, setOrderScopeTypeOption] =
    useState<SelectOption>(orderTypeSelectOptions[0]);
  const [takerAddress, setTakerAddress] = useState("");
  const [makerAmount, setMakerAmount] = useState(defaultMakerAmount);
  const [takerAmount, setTakerAmount] = useState("");

  // States derived from user input
  const makerAmountPlusFee = useAmountPlusFee(
    makerAmount,
    makerTokenDecimals,
    makerTokenKind
  );

  const spenderAddressType = isLimitOrder
    ? "delegate"
    : makerTokenKind === TokenKinds.ERC20
    ? "swapERC20"
    : "swap";
  const { hasSufficientAllowance, readableAllowance } = useAllowance(
    makerTokenInfo,
    signerShouldPayProtocolFee ? makerAmountPlusFee : makerAmount,
    { spenderAddressType }
  );

  const hasInsufficientBalance = useInsufficientBalance(
    makerTokenInfo,
    signerShouldPayProtocolFee ? makerAmountPlusFee : makerAmount,
    true
  );
  const isBalanceLoading = useBalanceLoading();
  const hasMissingMakerAmount =
    !makerAmount.length || parseFloat(makerAmount) === 0 || makerAmount === ".";
  const hasMissingTakerAmount =
    !takerAmount.length || parseFloat(takerAmount) === 0 || takerAmount === ".";
  const maxAmount = useMaxAmount(makerTokenInfo || null, true);
  const showMaxButton =
    !!maxAmount &&
    makerAmount !== maxAmount &&
    userTokens.tokenFrom?.kind !== TokenKinds.ERC721;
  const showMaxInfoButton =
    !!maxAmount && makerTokenInfo?.address === ADDRESS_ZERO;
  const [activeSetRuleHash, setActiveSetRuleHash] = useState<string>();
  const approvalTransaction = useApprovalPending(makerTokenInfo?.address, true);
  const depositTransaction = useDepositPending(true);
  const setRuleTransaction = useSetRuleTransaction(activeSetRuleHash);
  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    makerTokenInfo?.address,
    makerAmount,
    signerShouldPayProtocolFee
  );
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const isValidAddress = useValidAddress(takerAddress);
  const isAllowancesOrBalancesFailed = useAllowancesOrBalancesFailed();
  const isNetworkSupported = useNetworkSupported();
  const shouldShowApprovalNotice = useShouldShowApprovalNotice({
    chainId,
    orderAmount: signerShouldPayProtocolFee ? makerAmountPlusFee : makerAmount,
    spenderAddressType,
    tokenInfo: makerTokenInfo,
    takerTokenInfo,
  });
  const shouldShowOverwriteLimitOrderNotice =
    useShouldShowOverwriteLimitOrderNotice({
      chainId,
      makerTokenInfo,
      takerTokenInfo,
    });

  // Modal states
  const { setShowWalletList, transactionsTabIsOpen } =
    useContext(InterfaceContext);
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const [showTokenSelectModal, setShowTokenSelectModal] =
    useState<TokenSelectModalTypes>(null);

  // Review states
  const showWrapReview =
    state === MakeWidgetState.review && shouldDepositNativeToken;
  const showApproveReview =
    (state === MakeWidgetState.review && !hasSufficientAllowance) ||
    !!approvalTransaction;
  const showOrderReview = state === MakeWidgetState.review;

  // useEffects
  useEffect(() => {
    dispatch(reset());

    if (isNftSupported) {
      return;
    }

    const defaultToken = {
      address: defaultTokenToAddress,
      kind: TokenKinds.ERC20,
    };

    dispatch(
      setUserTokens({
        ...(makerTokenKind !== TokenKinds.ERC20 && { tokenFrom: defaultToken }),
        ...(takerTokenKind !== TokenKinds.ERC20 && { tokenTo: defaultToken }),
      })
    );
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
      const compressedOrder = isFullOrder(lastUserOrder)
        ? compressFullOrder(lastUserOrder)
        : compressFullOrderERC20(lastUserOrder);
      dispatch(clearLastUserOrder());
      history.push(routes.otcOrder(compressedOrder));

      notifyOrderCreated();
    }
  }, [lastUserOrder, history, dispatch]);

  useEffect(() => {
    if (lastDelegateRule) {
      dispatch(clearLastUserOrder());
      history.push(
        routes.limitOrder(
          lastDelegateRule.senderWallet,
          lastDelegateRule.senderToken,
          lastDelegateRule.signerToken,
          lastDelegateRule.chainId
        )
      );

      notifyOrderCreated();
    }
  }, [lastDelegateRule, history, dispatch]);

  useEffect(() => {
    if (!isActive) {
      setShowTokenSelectModal(null);
    }
  }, [isActive]);

  const handleSetToken = (type: TokenSelectModalTypes, newToken: UserToken) => {
    const defaultToken = {
      address: defaultTokenToAddress,
      kind: TokenKinds.ERC20,
    };
    const { tokenFrom, tokenTo } = getNewTokenPair(
      type,
      newToken,
      userTokens.tokenTo || defaultToken || undefined,
      userTokens.tokenFrom || undefined
    );

    if (tokenFrom?.kind !== TokenKinds.ERC20 && type === "base") {
      setMakerAmount("1");
    } else if (tokenTo?.kind !== TokenKinds.ERC20 && type === "quote") {
      setTakerAmount("1");
    }

    dispatch(
      setUserTokens({
        tokenFrom,
        tokenTo,
      })
    );
  };

  const handleMakerAmountChange = (amount: string) => {
    setMakerAmount(
      toMaxAllowedDecimalsNumberString(amount, makerTokenDecimals)
    );
  };

  const handleTakerAmountChange = (amount: string) => {
    setTakerAmount(
      toMaxAllowedDecimalsNumberString(amount, takerTokenDecimals)
    );
  };

  const handleSwitchTokensButtonClick = () => {
    handleSetToken(
      "base",
      userTokens.tokenTo || {
        address: defaultTokenToAddress,
        kind: TokenKinds.ERC20,
      }
    );
    setMakerAmount(takerAmount);
    setTakerAmount(makerAmount);
  };

  const handleTokenSelect = (newToken: AppTokenInfo) => {
    const tokenId = isCollectionTokenInfo(newToken) ? newToken.id : undefined;
    const tokenKind = getTokenKind(newToken);

    handleSetToken(showTokenSelectModal, {
      address: newToken.address,
      tokenId,
      kind: tokenKind,
    });

    if (tokenKind === TokenKinds.ERC721) {
      setMakerAmount("1");
    }

    setShowTokenSelectModal(null);
  };

  const reviewOrder = () => {
    if (orderType === OrderType.private && !isValidAddress) {
      dispatch(setError({ type: AppErrorType.invalidAddress }));

      return;
    }

    const formattedMakerAmount = toRoundedNumberString(
      makerAmount,
      makerTokenDecimals
    );
    const formattedTakerAmount = toRoundedNumberString(
      takerAmount,
      takerTokenDecimals
    );

    setMakerAmount(formattedMakerAmount);
    setTakerAmount(formattedTakerAmount);

    setState(MakeWidgetState.review);
  };

  const createOrder = async () => {
    if (!makerTokenInfo || !takerTokenInfo) {
      throw new Error("Maker or taker token info is not set");
    }

    const expiryDate = Date.now() + expiry;
    const makerTokenAddress = makerTokenInfo.address;
    const takerTokenAddress = takerTokenInfo.address;

    const signerToken =
      makerTokenAddress === ADDRESS_ZERO
        ? getWethAddress(chainId!)
        : makerTokenAddress;
    const senderToken =
      takerTokenAddress === ADDRESS_ZERO
        ? getWethAddress(chainId!)
        : takerTokenAddress;

    const signerTokenId = isCollectionTokenInfo(makerTokenInfo!)
      ? makerTokenInfo.id
      : "0";

    const senderTokenId = isCollectionTokenInfo(takerTokenInfo!)
      ? takerTokenInfo.id
      : "0";

    const transaction = await dispatch(
      createOtcOrDelegateOrder({
        isLimitOrder,
        nonce: expiryDate.toString(),
        expiry: Math.floor(expiryDate / 1000).toString(),
        signerTokenInfo: makerTokenInfo!,
        senderTokenInfo: takerTokenInfo!,
        signer: {
          wallet: account!,
          token: signerToken,
          amount: makerAmount,
          id: signerTokenId,
          kind: getTokenKind(makerTokenInfo!),
        },
        sender: {
          wallet:
            orderType === OrderType.private ? takerAddress! : ADDRESS_ZERO,
          token: senderToken,
          amount: takerAmount,
          id: senderTokenId,
          kind: getTokenKind(takerTokenInfo!),
        },
        protocolFee: protocolFee.toString(),
        chainId: chainId!,
        library: library!,
        activeIndexers: indexerUrls,
        shouldSendToIndexers: orderType === OrderType.publicListed,
      })
    );

    if (transaction !== undefined) {
      setActiveSetRuleHash(transaction.hash);
    }
  };

  const approveToken = () => {
    const justifiedToken =
      makerTokenInfo?.address === ADDRESS_ZERO
        ? wrappedNativeToken
        : makerTokenInfo;

    dispatch(
      approve(
        signerShouldPayProtocolFee ? makerAmountPlusFee : makerAmount,
        justifiedToken!,
        library!,
        isLimitOrder
          ? "Delegate"
          : makerTokenKind === TokenKinds.ERC20
          ? "SwapERC20"
          : "Swap"
      )
    );
  };

  const depositNativeToken = async () => {
    dispatch(
      deposit(
        shouldDepositNativeTokenAmount!,
        makerTokenInfo! as TokenInfo,
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
      setState(MakeWidgetState.list);
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

  const handleShowLimitOrderButtonClick = () => {
    if (setRuleTransaction) {
      history.push(
        routes.limitOrder(
          setRuleTransaction.rule.senderWallet,
          setRuleTransaction.rule.senderToken,
          setRuleTransaction.rule.signerToken,
          setRuleTransaction.rule.chainId
        )
      );
    }
  };

  const renderScreens = () => {
    if (showWrapReview) {
      return (
        <>
          <WrapReview
            hasEditButton
            isLoading={!!depositTransaction}
            amount={makerAmount}
            amountPlusFee={isLimitOrder ? undefined : makerAmountPlusFee}
            shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={handleEditButtonClick}
            onRestartButtonClick={restart}
            onSignButtonClick={depositNativeToken}
          />
        </>
      );
    }

    if (showApproveReview) {
      return (
        <>
          <ApproveReview
            hasEditButton
            isLoading={!!approvalTransaction}
            amount={makerAmount}
            amountPlusFee={
              signerShouldPayProtocolFee ? makerAmountPlusFee : undefined
            }
            readableAllowance={readableAllowance}
            token={makerTokenInfo}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={handleEditButtonClick}
            onRestartButtonClick={restart}
            onSignButtonClick={approveToken}
          />

          {shouldShowApprovalNotice && (
            <ApprovalNotice
              activeState="approvalReview"
              orderAmount={
                signerShouldPayProtocolFee ? makerAmountPlusFee : makerAmount
              }
              chainId={chainId}
              spenderAddressType={spenderAddressType}
              tokenInfo={makerTokenInfo}
              takerTokenInfo={takerTokenInfo}
            />
          )}
        </>
      );
    }

    if (showOrderReview) {
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
            signerAmountPlusFee={
              signerShouldPayProtocolFee ? makerAmountPlusFee : undefined
            }
            signerToken={makerTokenInfo}
            wrappedNativeToken={wrappedNativeToken}
            onEditButtonClick={handleEditButtonClick}
            onSignButtonClick={createOrder}
          />
          {shouldShowOverwriteLimitOrderNotice && <OverwriteLimitOrderNotice />}

          {shouldShowApprovalNotice && (
            <ApprovalNotice
              activeState="orderReview"
              orderAmount={
                signerShouldPayProtocolFee ? makerAmountPlusFee : makerAmount
              }
              chainId={chainId}
              spenderAddressType={spenderAddressType}
              tokenInfo={makerTokenInfo}
            />
          )}
        </>
      );
    }

    return (
      <>
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
          {!isLimitOrder && (
            <StyledOrderTypeSelector
              isDisabled={!isActive}
              options={orderTypeSelectOptions}
              selectedOrderTypeOption={orderScopeTypeOption}
              onChange={setOrderScopeTypeOption}
            />
          )}

          <StyledExpirySelector
            fullWidth={isLimitOrder}
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
          makerTokenSymbol={makerTokenSymbol}
          onBackButtonClick={handleBackButtonClick}
          onActionButtonClick={handleActionButtonClick}
        />

        {showLimitNotice && isLimitOrder && (
          <StyledNotice
            text={t("information.limitOrder")}
            onCloseButtonClick={() => setShowLimitNotice(false)}
          />
        )}
      </>
    );
  };

  return (
    <Container
      hidePageNavigation={
        showWrapReview || showApproveReview || showOrderReview
      }
    >
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

      <TransactionOverlay isHidden={!setRuleTransaction}>
        {setRuleTransaction && (
          <SetRuleSubmittedScreen
            chainId={chainId}
            transaction={setRuleTransaction}
            onMakeNewLimitOrderButtonClick={restart}
            onShowLimitOrderButtonClick={handleShowLimitOrderButtonClick}
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
          activeTokens={
            isNftSupported && showTokenSelectModal === "base"
              ? activeTokens
              : activeErc20Tokens
          }
          allTokens={
            isNftSupported && showTokenSelectModal === "base"
              ? allTokens
              : erc20Tokens
          }
          balances={balances}
          onSelectToken={handleTokenSelect}
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
