import { AppRoutes } from "../../../routes";
import { InformationModalType } from "../../InformationModals/InformationModals";

export function getInformationModalFromRoute(
  route: AppRoutes | undefined
): InformationModalType | undefined {
  switch (route) {
    case AppRoutes.join:
      return AppRoutes.join;
    default:
      return undefined;
  }
}
