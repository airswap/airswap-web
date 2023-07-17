import React, { FC, useEffect } from "react";

import { useAppDispatch } from "../../app/hooks";
import MakeWidget from "../../components/MakeWidget/MakeWidget";
import { reset } from "../../features/takeOtc/takeOtcSlice";
import { StyledPage } from "./Make.styles";

const MakePage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <StyledPage>
      <MakeWidget />
    </StyledPage>
  );
};

export default MakePage;
