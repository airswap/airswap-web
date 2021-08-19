import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { formatUnits } from "@ethersproject/units";
import { TokenInfo } from "@uniswap/token-lists";

import { BalancesState } from "../../features/balances/balancesSlice";
import { defaultActiveTokens } from "../../features/metadata/metadataApi";
import useWindowSize from "../../helpers/useWindowSize";
import { Title } from "../Typography/Typography";
import {
  Container,
  TitleContainer,
  CloseButton,
  SearchInput,
  TokenContainer,
  Legend,
  LegendItem,
  LegendDivider,
  ScrollContainer,
} from "./TokenSelection.styles";
import { filterTokens } from "./filter";
import { sortTokensBySymbolAndBalance } from "./sort";
import InactiveTokensList from "./subcomponents/InactiveTokensList/InactiveTokensList";
import TokenButton from "./subcomponents/TokenButton/TokenButton";

export type TokenSelectionProps = {
  /**
   * Function to close modal
   */
  onClose: () => void;
  /**
   * signerToken contract address (e.g. "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
   */
  signerToken: string;
  /**
   * senderToken contract address (e.g. "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2")
   */
  senderToken: string;
  /**
   * useState hook to set signer token
   */
  setSignerToken: (val: string) => void;
  /**
   * useState hook to set sender token
   */
  setSenderToken: (val: string) => void;
  /**
   * Request type incoming to token selection modal; modal handles
   * setSignerToken/setSenderToken based off of this parameter
   */
  tokenSelectType: "signerToken" | "senderToken";
  /**
   * Balances for current tokens in wallet
   */
  balances: BalancesState;
  /**
   * all Token addresses in metadata.
   */
  allTokens: TokenInfo[];
  /**
   * All active tokens.
   */
  activeTokens: TokenInfo[];
  /**
   * Supported tokens according to registry
   */
  supportedTokenAddresses: string[];
  /**
   * function to handle adding active tokens (dispatches addActiveToken).
   */
  addActiveToken: (val: string) => void;
  /**
   * function to handle removing active tokens (dispatches removeActiveToken).
   */
  removeActiveToken: (val: string) => void;
  /**
   * currently connected chain id
   */
  chainId: number;
};

const TokenSelection = ({
  onClose,
  signerToken,
  senderToken,
  setSignerToken,
  setSenderToken,
  tokenSelectType,
  balances,
  allTokens,
  activeTokens = [],
  supportedTokenAddresses,
  addActiveToken,
  removeActiveToken,
  chainId,
}: TokenSelectionProps) => {
  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  const [tokenQuery, setTokenQuery] = useState<string>("");
  const { t } = useTranslation(["common", "wallet", "orders", "balances"]);

  // handle user clicking row
  const handleClick = (address: string) => {
    if (tokenSelectType === "senderToken") {
      // swap the token addresses
      if (address === signerToken) setSignerToken(senderToken);
      setSenderToken(address);
    } else {
      if (address === senderToken) setSenderToken(signerToken);
      setSignerToken(address);
    }
    onClose();
  };

  // sort tokens based on symbol
  const sortedTokens: TokenInfo[] = useMemo(() => {
    return sortTokensBySymbolAndBalance(activeTokens, balances);
  }, [activeTokens, balances]);

  // filter token
  const filteredTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(sortedTokens), tokenQuery);
  }, [sortedTokens, tokenQuery]);

  useEffect(() => {
    if (containerRef.current && scrollContainerRef.current) {
      const { offsetTop, scrollHeight } = scrollContainerRef.current;
      setOverflow(scrollHeight + offsetTop > containerRef.current.offsetHeight);
    }
  }, [
    containerRef,
    scrollContainerRef,
    activeTokens,
    sortedTokens,
    allTokens,
    tokenQuery,
    width,
    height,
  ]);

  return (
    <Container ref={containerRef} $overflow={overflow}>
      <TitleContainer>
        <Title type="h2">{t("common:swap")}</Title>
        <CloseButton icon="chevron-down" iconSize={1} onClick={onClose} />
      </TitleContainer>
      <SearchInput
        hideLabel
        id="tokenQuery"
        type="text"
        label="Search name or address"
        value={tokenQuery}
        placeholder="Search name or paste address"
        onChange={(e) => {
          setTokenQuery(e.currentTarget.value);
        }}
      />

      <ScrollContainer ref={scrollContainerRef}>
        <Legend>
          <LegendItem>{t("common:token")}</LegendItem>
          <LegendDivider />
          <LegendItem>{t("balances:balance")}</LegendItem>
        </Legend>

        {filteredTokens && filteredTokens.length > 0 && (
          <TokenContainer>
            {filteredTokens.map((token) => (
              <TokenButton
                token={token}
                balance={formatUnits(
                  balances.values[token.address] || 0,
                  token.decimals
                )}
                setToken={handleClick}
                disabled={
                  tokenSelectType === "senderToken"
                    ? token.address === senderToken
                    : token.address === signerToken
                } // shouldn't be able to select same duplicate token
                removeActiveToken={removeActiveToken}
                defaultToken={defaultActiveTokens[chainId!].includes(
                  token.address
                )}
                key={token.address}
              />
            ))}
          </TokenContainer>
        )}
        {chainId === 1 && tokenQuery && filteredTokens.length < 5 && (
          <InactiveTokensList
            tokenQuery={tokenQuery}
            activeTokens={activeTokens}
            allTokens={allTokens}
            supportedTokenAddresses={supportedTokenAddresses}
            onTokenClick={(tokenAddress) => {
              addActiveToken(tokenAddress);
              setTokenQuery("");
            }}
          />
        )}
      </ScrollContainer>
    </Container>
  );
};

export default TokenSelection;
