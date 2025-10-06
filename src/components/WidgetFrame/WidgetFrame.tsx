import React, {
  FC,
  ReactElement,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import useElementSize from "../../hooks/useElementSize";
import useWindowSize from "../../hooks/useWindowSize";
import { WidgetFrameWrapper, Container } from "./WidgetFrame.styles";

type WidgetFrameType = {
  children?: React.ReactNode;
  isConnected?: boolean;
  isOverlayOpen?: boolean;
};

const WidgetFrame: FC<WidgetFrameType> = ({
  children,
  isConnected,
  isOverlayOpen,
}): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const { height: containerHeight } = useElementSize(containerRef);
  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (windowHeight) {
      setIsOverflowing(containerHeight > windowHeight);
    }
  }, [containerHeight, windowHeight]);

  return (
    <Container
      $isConnected={isConnected}
      $isOverlayOpen={isOverlayOpen}
      $isOverflowing={isOverflowing}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <WidgetFrameWrapper id="widget-frame-wrapper" ref={containerRef}>
          {children}
        </WidgetFrameWrapper>
      </Suspense>
    </Container>
  );
};

export default WidgetFrame;
