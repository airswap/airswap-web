import { useAppSelector } from "../../../app/hooks";
import type { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { compareAddresses } from "../../../helpers/string";

type ShouldShowOverwriteLimitOrderNoticeProps = {
  chainId?: number;
  makerTokenInfo: AppTokenInfo | null;
  takerTokenInfo: AppTokenInfo | null;
};

export const useShouldShowOverwriteLimitOrderNotice = (
  props: ShouldShowOverwriteLimitOrderNoticeProps
) => {
  const { chainId, makerTokenInfo, takerTokenInfo } = props;

  const { delegateRules } = useAppSelector((state) => state.delegateRules);

  if (!chainId || !makerTokenInfo || !takerTokenInfo) {
    return false;
  }

  const shouldShowOverwriteLimitOrderNotice = delegateRules.some(
    (rule) =>
      rule.expiry > Math.floor(new Date().getTime() / 1000) &&
      rule.chainId === chainId &&
      rule.senderFilledAmount !== rule.senderAmount &&
      compareAddresses(rule.senderToken, makerTokenInfo.address) &&
      compareAddresses(rule.signerToken, takerTokenInfo.address)
  );

  return shouldShowOverwriteLimitOrderNotice;
};
