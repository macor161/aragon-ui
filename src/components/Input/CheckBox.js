import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { IconCheck } from '../../icons'
import theme from '../../theme'
import { springs, noop } from '../../utils'
import FocusVisible from '../FocusVisible/FocusVisible'

class CheckBox extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    mixed: PropTypes.bool,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    checked: false,
    mixed: false,
    onChange: noop,
  }
  _element = React.createRef()
  getAriaChecked() {
    const { checked, mixed } = this.props
    if (mixed) return 'mixed'
    if (checked) return 'true'
    return 'false'
  }
  handleClick = () => {
    this.props.onChange(!this.props.checked)
  }
  render() {
    const { checked, mixed, focusVisible, ...props } = this.props
    return (
      <FocusVisible element={this._element && this._element.current}>
        {focusVisible => (
          <Main
            role="checkbox"
            tabIndex="0"
            aria-checked={this.getAriaChecked()}
            onClick={this.handleClick}
            ref={this._element}
            focusVisible={focusVisible}
            {...props}
          >
            <Spring
              from={{ progress: 0 }}
              to={{ progress: Boolean(checked) }}
              config={springs.instant}
              native
            >
              {({ progress }) => (
                <CheckWrapper
                  style={{
                    opacity: progress,
                    transform: progress.interpolate(v => `scale(${v})`),
                  }}
                >
                  <Check />
                </CheckWrapper>
              )}
            </Spring>
            <FocusRing />
          </Main>
        )}
      </FocusVisible>
    )
  }
}

const FocusRing = styled.span`
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid ${theme.accent};
  border-radius: 3px;
  display: none;
`

const Main = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  position: relative;
  width: 14px;
  height: 14px;
  margin: 5px;
  background: #f3f9fb;
  border: 1px solid #daeaef;
  border-radius: 3px;
  outline: 0;
  padding: 0;
  cursor: pointer;
  &:active {
    border-color: #c9d9de;
  }
  &:focus ${FocusRing} {
    display: ${p => (p.focusVisible ? 'block' : 'none')};
  }
  &::-moz-focus-inner {
    border: 0;
  }
`

const CheckWrapper = styled(animated.span)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Check = styled(IconCheck)`
  /* Use a filter to make it black, until we have a color system for icons */
  filter: brightness(0);
  transform-origin: 50% 50%;
  transform: scale(0.9);
`

export default CheckBox