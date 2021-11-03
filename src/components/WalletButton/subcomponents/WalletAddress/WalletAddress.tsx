import { useLayoutEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import truncateEthAddress from "truncate-eth-address";

import BorderedButton from "../../../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../../../Typography/Typography";
import {
  BlockiesContainer,
  GreenCircle,
  Button,
  StyledBlockies,
} from "./WalletAddress.styles";

type WalletBlockiesProps = {
  address: string;
  isButton?: boolean;
  showBlockies?: boolean;
  onClick?: () => void;
};

// This is an in-memory cache that will be lost when we refresh the page, as
// ENS records may change, but we probably only need to check once between
// refreshes. Format: { [chainId]: { [address]: name | null }}
const ensCachedResponses: Record<number, Record<string, string | null>> = {};

const WalletAddress = ({
  address,
  isButton = false,
  showBlockies = false,
  onClick,
}: WalletBlockiesProps) => {
  const { library, chainId } = useWeb3React<Web3Provider>();

  const [ensName, setEnsName] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!address || !chainId || !library) return;

    const cached = ensCachedResponses[chainId]?.[address];
    if (cached !== undefined) {
      setEnsName(cached);
    } else {
      library.lookupAddress(address).then((name) => {
        ensCachedResponses[chainId] = {
          ...ensCachedResponses[chainId],
          [address]: name,
        };
        setEnsName(name);
      });
    }
  }, [library, address, chainId]);

  const renderContent = () => (
    <BorderedButton>
      {showBlockies ? (
        <BlockiesContainer>
          <StyledBlockies
            size={8}
            scale={3}
            seed={address}
            bgColor="black"
            color="#2b72ff"
          />
        </BlockiesContainer>
      ) : (
        <GreenCircle />
      )}
      <InfoHeading>
        {ensName ? ensName : truncateEthAddress(address)}
      </InfoHeading>
    </BorderedButton>
  );

  if (isButton) {
    return <Button onClick={onClick}>{renderContent()}</Button>;
  }

  return renderContent();
};

export default WalletAddress;
