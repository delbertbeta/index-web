import React from 'react';
import styled from 'styled-components';
import { faro } from '@grafana/faro-web-sdk';

const VerticalLink = styled.a`
  display: block;
  writing-mode: vertical-rl;
  transition: color 0.5s ease;
  padding: 18px 6px;
  font-size: 18px;
  color: #262626;
  cursor: pointer;
  width: 20px;
  line-height: 20px;
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
  z-index: 1;
  transition: transform 0.5s ease;
  transform: translateY(0);

  & + & {
    margin-left: 8px;
  }

  &:hover > ${VerticalLink} {
    color: #fff;
  }

  &:hover > ${Background} {
    transform: scaleY(1);
  }

  &:hover {
    transform: translateY(8px);
  }
`;

interface ILinkProp {
  content: string;
  url: string;
}

const Link = ({ content, url }: ILinkProp) => {
  return (
    <Container>
      <VerticalLink href={url} onClick={() => { faro.api.pushEvent('click_link', { item: content }) }}>{content}</VerticalLink>
      <Background />
    </Container>
  );
};

export default Link;
