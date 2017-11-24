/* @flow */
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import ClickOutHandler from 'react-onclickout'
import { spring as springConf, unselectable } from '../../shared-styles'
import getPublicUrl, { prefixUrl } from '../../public-url'
import theme from '../../theme'

import close from './assets/close.svg'
import menu from './assets/menu.svg'

const Container = styled.div`
  min-height: 60px;
  ${unselectable()};
`

const PanelStyles = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  padding-top: 70px;
  line-height: 2;
  font-size: 17px;
  background: ${theme.accent};
  a {
    color: white;
    text-decoration: none;
  }
`

const PanelContent = styled.div`
  padding: 0 60px 30px 30px;
  a {
    display: block;
  }
`

const Toggle = styled.a.attrs({ role: 'button' })`
  position: absolute;
  right: 0;
  z-index: 4;
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const renderLinkDefault = ({
  url,
  children,
}: {
  url: string,
  children: Node,
}) => <a href={url}>{children}</a>

type Props = {
  items: Array<[string, string, boolean]>,
  publicUrl: string,
  renderLink: mixed,
}

type State = {
  opened: boolean,
}

class Panel extends React.Component<Props, State> {
  state = {
    opened: false,
  }
  toggle = () => {
    this.setState({ opened: !this.state.opened })
  }
  close = () => {
    this.setState({ opened: false })
  }
  render() {
    const { items, publicUrl, renderLink = renderLinkDefault } = this.props
    const { opened } = this.state
    return (
      <Motion
        style={{
          openProgress: spring(Number(opened), springConf('fast')),
        }}
      >
        {({ openProgress }) => (
          <Container>
            <ClickOutHandler onClickOut={this.close}>
              <Toggle onClick={this.toggle}>
                <img src={prefixUrl(opened ? close : menu, publicUrl)} alt="" />
              </Toggle>
              <PanelStyles
                style={{
                  display: openProgress > 0 ? 'block' : 'none',
                  opacity: openProgress,
                  transform: `translateY(-${(1 - openProgress) * 5}px)`,
                }}
              >
                <PanelContent>
                  {items.map(([url, label, active]) => (
                    <div key={url} onClick={this.close}>
                      {renderLink({
                        url,
                        children: label,
                      })}
                    </div>
                  ))}
                </PanelContent>
              </PanelStyles>
            </ClickOutHandler>
          </Container>
        )}
      </Motion>
    )
  }
}

export default getPublicUrl(Panel)