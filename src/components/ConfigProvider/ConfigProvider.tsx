import React from 'react';
import { canUseDOM } from '../../lib/dom';
import {
  ConfigProviderContext,
  ConfigProviderContextInterface,
  Scheme,
  defaultConfigProviderProps,
} from './ConfigProviderContext';
import { HasChildren, DOMProps } from '../../types';
import { AppearanceSchemeType } from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';

export interface ConfigProviderProps extends ConfigProviderContextInterface, HasChildren {}

export default class ConfigProvider extends React.Component<ConfigProviderProps> {
  constructor(props: ConfigProviderProps, context: DOMProps) {
    super(props);
    if (canUseDOM) {
      this.setScheme(this.mapOldScheme(props.scheme), context);
    }
  }

  static contextTypes = {
    document: PropTypes.any,
  };

  get document() {
    return this.context.document || document;
  }

  // Деструктуризация нужна из бага в react-docgen-typescript
  // https://github.com/styleguidist/react-docgen-typescript/issues/195
  public static defaultProps = { ...defaultConfigProviderProps };

  mapOldScheme(scheme: AppearanceSchemeType): AppearanceSchemeType {
    switch (scheme) {
      case Scheme.DEPRECATED_CLIENT_LIGHT:
        return Scheme.BRIGHT_LIGHT;
      case Scheme.DEPRECATED_CLIENT_DARK:
        return Scheme.SPACE_GRAY;
      default:
        return scheme;
    }
  }

  setScheme = (scheme: AppearanceSchemeType, context: DOMProps): void => {
    (context.document || document).body.setAttribute('scheme', scheme);
  };

  componentDidUpdate(prevProps: ConfigProviderProps) {
    if (prevProps.scheme !== this.props.scheme) {
      this.setScheme(this.mapOldScheme(this.props.scheme), this.context);
    }
  }

  getContext(): ConfigProviderProps {
    return {
      isWebView: this.props.isWebView,
      webviewType: this.props.webviewType,
      scheme: this.mapOldScheme(this.props.scheme),
      appearance: this.props.appearance,
      app: this.props.app,
      transitionMotionEnabled: this.props.transitionMotionEnabled,
      platform: this.props.platform,
      viewportNode: this.props.viewportNode || this.document.body,
    };
  }

  render() {
    return (
      <ConfigProviderContext.Provider value={this.getContext()}>
        {this.props.children}
      </ConfigProviderContext.Provider>
    );
  }
}
