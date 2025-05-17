import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";

import useElementSize from "../../hooks/useElementSize";
import useWindowSize from "../../hooks/useWindowSize";
import { Container } from "./FadedScrollContainer.styles";

type FadedScrollContainerProps = {
  className?: string;
  resizeDependencies: any[];
};

export const FadedScrollContainer: FC<
  PropsWithChildren<FadedScrollContainerProps>
> = ({ className, children, resizeDependencies }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const { height: scrollContainerHeight } = useElementSize(ref);

  const [hasTokenListOverflow, setHasTokenListOverflow] = useState(false);
  const [hasTokenListScrolledToBottom, setHasTokenListScrolledToBottom] =
    useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;

    setHasTokenListScrolledToBottom(scrollTop + clientHeight >= scrollHeight);
  };

  useEffect(() => {
    if (ref.current) {
      const { clientHeight, scrollHeight } = ref.current;

      setHasTokenListOverflow(scrollHeight > clientHeight);
    }
  }, [...resizeDependencies, scrollContainerHeight, width, height]);

  return (
    <Container
      className={className}
      ref={ref}
      $overflow={hasTokenListOverflow}
      hasScrolledToBottom={hasTokenListScrolledToBottom}
      onScroll={handleScroll}
    >
      {children}
    </Container>
  );
};
