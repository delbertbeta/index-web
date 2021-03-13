import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Link from './components/link';
import { ReactComponent as LogoIcon } from './assets/icon.svg';

const StyledLogoIcon = styled(LogoIcon)`
  width: 16px;
  transition: all 0.5s ease;
  margin-top: 18px;
  margin-right: 16px;
  height: 32px;
  width: 32px;

  & > path:nth-child(3) {
    fill: #888;
  }

  & > path:last-child {
    fill: #3b3b3b;
  }

  & > path {
    transition: fill 0.5s ease;
  }

  :hover {
    & {
      filter: drop-shadow(0 0 4px #40a9ff);
    }
    & > path:nth-child(3) {
      fill: #91d5ff;
    }

    & > path:last-child {
      fill: #40a9ff;
    }
  }
`;

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ededed;
  flex-direction: column;
`;

const LinkContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 20px;
  padding: 6px 32px;
  margin-bottom: 18px;
  color: #fff;
  background-color: #262626;
  text-align: center;
`;

const SubTitle = styled.div`
  font-size: 14px;
`;

interface IHoverProps {
  isHover: boolean;
}

const StandardLinks = styled(LinkContainer)<IHoverProps>`
  transition: transform 0.5s ease;
  transform: translateX(${props => props.isHover ? 36 : 0}px);
`;
const HiddenLinks = styled(LinkContainer)<IHoverProps>`
  transition: all 0.5s ease;
  top: -4px;
  left: 46px;
  position: absolute;
  transform: translateX(${props => props.isHover ? 0 : -36}px);
  pointer-events: none;
  opacity: ${props => props.isHover ? 1 : 0};
`;

const ICPStaff = styled.a`
  position: absolute;
  right: 24px;
  bottom: 24px;
  font-size: 14px;
  color: #262626;
  text-decoration: underline;
`;

const App: React.FC = () => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const handleMouseEnter = useCallback(() => setIsHover(true), []);
  const handleMouseLeave = useCallback(() => setIsHover(false), []);
  return (
    <StyledContainer>
      <Title>
        <div>索引</div>
        <SubTitle>delbertbeta</SubTitle>
      </Title>
      <LinkContainer>
        <StyledLogoIcon onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
        <HiddenLinks isHover={isHover}>
          <Link content="❤ Shyrii" url="javascipt:void" />
        </HiddenLinks>
        <StandardLinks isHover={isHover}>
          <Link content="博客" url="https://blog.delbertbeta.life" />
          <Link content="With Shyrii" url="https://shyrii.delbertbeta.life" />
          <Link content="代码托管" url="https://code.delbertbeta.life" />
          {/*
          <Link content="文件分享" url="https://rajio.delbertbeta.life" />
          <Link content="监控" url="https://grafana.delbertbeta.cc" />
          <Link content="Rust Crates" url="https://grafana.delbertbeta.cc" />
          <Link content="下载代理" url="https://code.delbertbeta.cc/delbertbeta/proxy-downloader" />
          */}
        </StandardLinks>
      </LinkContainer>
      <ICPStaff href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2021020587号</ICPStaff>
    </StyledContainer>
  );
}

export default App;
