import styled from "styled-components/macro";

export const Text = styled.div`
  font-weight: bold;
`;
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  margin-left: auto;

  & > .icon {
    margin-bottom: -2px;
  }
`;

export const RateBox = styled.div`
  border-radius: 0.15rem;
  border: 1px solid white;
  padding: 0 0.3rem 0 0.3rem;
  line-height: 1.8rem;
  font-family: "DM Mono";
  font-size: 0.85rem;
`;
