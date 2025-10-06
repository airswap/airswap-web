import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import useAllowance, { AllowancesType } from "../../../hooks/useAllowance";
import { getTotalNeededAllowance } from "../helpers";
import { useTotalTokenAllowanceFromOrders } from "./useTotalTokenAllowanceFromOrders";

type UseShouldShowApprovalNoticeProps = {
  orderAmount?: string;
  chainId?: number;
  spenderAddressType: AllowancesType;
  tokenInfo: AppTokenInfo | null;
  takerTokenInfo?: AppTokenInfo | null;
  className?: string;
};

export const useShouldShowApprovalNotice = ({
  orderAmount,
  chainId,
  spenderAddressType,
  tokenInfo,
  takerTokenInfo,
}: UseShouldShowApprovalNoticeProps): boolean => {
  const [totalTokenAllowance, isLoadingTotalTokenAllowance] =
    useTotalTokenAllowanceFromOrders(
      spenderAddressType,
      tokenInfo,
      takerTokenInfo,
      chainId
    );

  const userHasNoOrders = totalTokenAllowance === "0";
  const totalNeededAllowance = getTotalNeededAllowance(
    orderAmount || "0",
    totalTokenAllowance || "0",
    tokenInfo
  );

  const { hasSufficientAllowance } = useAllowance(
    tokenInfo,
    totalNeededAllowance,
    { spenderAddressType }
  );

  if (
    userHasNoOrders ||
    hasSufficientAllowance ||
    isLoadingTotalTokenAllowance ||
    !totalTokenAllowance ||
    !tokenInfo
  ) {
    return false;
  }

  return true;
};
