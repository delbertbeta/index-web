import React from 'react';
import styled from 'styled-components';

const VerticalLink = styled.a`
  display: block;
  writing-mode: vertical-rl;
  transition: color 0.5s ease;
  padding: 16px 8px;
  color: #262626;
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #262626;
  transform-origin: 0 0;
  transform: scaleY(0);
  transition: transform 0.5s ease;
`;

const Container = styled.div`
  position: relative;
  height: 100%;
  z-index: 1;

  & + & {
    margin-left: 8px;
  }

  &:hover > ${VerticalLink} {
    color: #fff;
  }

  &:hover > ${Background} {
    transform: scaleY(1);
  }
`;

interface ILinkProp {
  content: string;
  url: string;
}

export default ({ content, url }: ILinkProp) => {
  return (
    <Container>
      <VerticalLink href={url}>{content}</VerticalLink>
      <Background />
    </Container>
  );
};
