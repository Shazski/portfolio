import { Component, ReactNode } from 'react';

/** Keeps a WebGL/three.js failure from blanking the whole page. */
export default class SafeCanvas extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('3D scene disabled:', err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
