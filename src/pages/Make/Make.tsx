import { useAppDispatch } from "../../app/hooks";
import MakeWidget from "../../components/@widgets/MakeWidget/MakeWidget";
import { reset } from "../../features/takeOtc/takeOtcSlice";
import { StyledPage } from "./Make.styles";
import React, { FC, useEffect } from "react";

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
