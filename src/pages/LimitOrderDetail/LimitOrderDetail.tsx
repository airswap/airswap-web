import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LimitOrderDetailWidget from "../../components/@widgets/LimitOrderDetailWidget/LimitOrderDetailWidget";
import Page from "../../components/Page/Page";
import { fetchAllTokens } from "../../features/metadata/metadataActions";
import { selectMetaDataReducer } from "../../features/metadata/metadataSlice";
import { getDelegateOrder } from "../../features/takeLimit/takeLimitActions";
import { reset } from "../../features/takeLimit/takeLimitSlice";
import useDefaultLibrary from "../../hooks/useDefaultLibrary";
import { InvalidOrder } from "../OtcOrderDetail/subcomponents";
import { StyledLoadingSpinner } from "./LimitOrderDetail.styles";
import NotFound from "./subcomponents/NotFound/NotFound";

const LimitOrderDetail: FC = () => {
  const dispatch = useAppDispatch();

  const { senderWallet, senderToken, signerToken, chainId } = useParams<{
    senderWallet: string;
    senderToken: string;
    signerToken: string;
    chainId: string;
  }>();

  const defaultLibrary = useDefaultLibrary(Number(chainId));

  const { status, delegateRule } = useAppSelector((state) => state.takeLimit);
  const { isFetchingAllTokens } = useAppSelector(selectMetaDataReducer);
  // Temporary state to force a re-render when the order is switched
  const [isSwitchingOrder, setIsSwitchingOrder] = useState(false);

  useEffect(() => {
    if (
      !defaultLibrary ||
      !senderWallet ||
      !signerToken ||
      !senderToken ||
      !chainId
    ) {
      return;
    }

    dispatch(
      getDelegateOrder({
        senderWallet,
        senderToken,
        signerToken,
        chainId: +chainId,
        library: defaultLibrary,
      })
    );

    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (delegateRule && !isFetchingAllTokens) {
      dispatch(fetchAllTokens(delegateRule.chainId));
      setIsSwitchingOrder(true);
    }
  }, [delegateRule]);

  useEffect(() => {
    if (isSwitchingOrder) {
      setIsSwitchingOrder(false);
    }
  }, [isSwitchingOrder]);

  if (status === "invalid" || status === "failed" || isSwitchingOrder) {
    return (
      <Page>
        <InvalidOrder />
      </Page>
    );
  }

  if (status === "not-found") {
    return (
      <Page>
        <NotFound />
      </Page>
    );
  }

  if (status === "idle" || !delegateRule) {
    return (
      <Page>
        <StyledLoadingSpinner />
      </Page>
    );
  }

  return (
    <Page>
      <LimitOrderDetailWidget delegateRule={delegateRule} />
    </Page>
  );
};

export default LimitOrderDetail;
