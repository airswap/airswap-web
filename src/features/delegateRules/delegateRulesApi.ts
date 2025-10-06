import { ADDRESS_ZERO } from "@airswap/utils";
import { BaseProvider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";
import { getDelegateRuleCall } from "../../entities/DelegateRule/DelegateRuleService";

export const fetchDelegateRules = createAsyncThunk<
  DelegateRule[],
  { delegateRules: DelegateRule[]; library: BaseProvider },
  { dispatch: AppDispatch; state: RootState }
>("delegateRules/fetchDelegateRules", async ({ delegateRules, library }) => {
  const response = await Promise.all(
    delegateRules.map((rule) =>
      getDelegateRuleCall({
        senderWallet: rule.senderWallet,
        senderToken: rule.senderToken,
        signerToken: rule.signerToken,
        chainId: rule.chainId,
        library,
      })
    )
  );

  return response.filter((rule) => rule.senderWallet !== ADDRESS_ZERO);
});
