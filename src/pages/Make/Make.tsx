import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import MakeWidget from "../../components/@widgets/MakeWidget/MakeWidget";
import { reset } from "../../features/takeOtc/takeOtcSlice";
import { StyledPage } from "./Make.styles";

interface MakePageProps {
  isLimitOrder?: boolean;
}

const MakePage: FC<MakePageProps> = ({ isLimitOrder = false }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <StyledPage>
      <MakeWidget isLimitOrder={isLimitOrder} />
    </StyledPage>
  );
};

export default MakePage;
