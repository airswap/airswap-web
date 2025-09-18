import { AppDispatch, RootState } from "../../app/store";
import { splitTokenIdentifier } from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { compareAddresses } from "../../helpers/string";
import { balancesActions } from "./balancesSlice";

export const updateNftBalances =
  (nftAddress: string, ownedTokens: string[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { balances } = getState();

    const keys = Object.keys(balances.values).filter((tokenId) => {
      const { address, id } = splitTokenIdentifier(tokenId);
      return !!id && compareAddresses(address, nftAddress);
    });

    const updatedBalances = keys.reduce((acc, tokenId) => {
      return {
        ...acc,
        [tokenId]: ownedTokens.includes(tokenId) ? "1" : "0",
      };
    }, {});

    dispatch(
      balancesActions.setBalances({
        ...balances.values,
        ...updatedBalances,
      })
    );
  };
