interface VNode {
  type: string;
  props: Record<string, any>;
  children: (VNode | string)[];
}

declare global {
  interface Window {
    [key: string]: (...args: any[]) => any;
  }
}

const PropsEvent: Record<string, string> = {
  "on-click": "click",
  "on-k-press": "onkeypress",
  "on-k-down": "onkeydown",
  "on-load": "onload",
  "on-mouse-ova": "onmouseover",
};

class Frost {
  private vDOM: VNode | null;
  // private oldVDOM: VNode | null;
  private root: HTMLElement | null;
  public state: Record<string, any>;
  public varRegex: RegExp;

  constructor() {
    this.vDOM = null;
    // this.oldVDOM = null;
    this.root = null;
    this.state = { counter: 0 };
    this.varRegex = new RegExp(/\{\{([^}]+)\}\}/g);
  }

  setState(newState: Record<string, any>) {
    this.state = { ...this.state, ...newState };
    this.update();
  }

  private update() {
    if (!this.root || !this.vDOM) return;

    this.updateTextNodes(this.root, this.vDOM);
  }

  private updateTextNodes(domNode: Node, vNode: VNode | string) {
    if (typeof vNode === "string") {
      const matches = vNode.match(/\{\{([^}]+)\}\}/g);
      if (matches) {
        for (const match of matches) {
          const key = match.replace("{{", "").replace("}}", "").trim();
          if (this.state[key] !== undefined) {
            domNode.textContent = vNode.replace(match, this.state[key]);
          }
        }
      }
      return;
    }
    if (domNode.childNodes.length === vNode.children.length) {
      domNode.childNodes.forEach((childNode, index) => {
        this.updateTextNodes(childNode, vNode.children[index]);
      });
    }
  }

  /**
   * create a virtual dom node
   * @param type - element type (h1, div etc...)
   * @param props - element property (id, class etc...)
   * @param children - element children
   * @returns virtual dom node
   */
  createElement(
    type: string,
    props: Record<string, any>,
    ...children: (VNode | string)[]
  ): VNode {
    return { type, props, children };
  }

  /**
   * render from virtual dom to real dom
   * @param vDOM - virtual dom to render
   * @param root - element of the dom to render
   */
  render(vDOM: VNode, root: HTMLElement) {
    this.vDOM = vDOM;
    this.root = root;
    this.update();
  }

  public parseDOM(node: Node): VNode | string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (!(node instanceof HTMLElement)) return "";
    const props: Record<string, any> = {};
    for (const attribute of node.attributes) {
      props[attribute.name] = attribute.value;
    }
    const children = Array.from(node.childNodes)
      .map((node) => this.parseDOM(node))
      .filter((child) => child != "");
    const vDOM: VNode = {
      type: node.nodeName.toLowerCase(),
      props,
      children,
    };
    if (vDOM.props) {
      for (const [key] of Object.entries(vDOM.props)) {
        const funcName = vDOM.props[key] as string;
        if (typeof window[funcName] === "function" && key in PropsEvent) {
          console.log(PropsEvent[key]);
          node.addEventListener(PropsEvent[key], (event) => {
            window[funcName](event);
          });
        }
      }
    }
    return vDOM;
  }
}

const frost = new Frost();

window.incrementCounter = () => {
  frost.setState({ counter: frost.state.counter + 1 });
};

window.decrementCounter = () => {
  frost.setState({ counter: frost.state.counter - 1 });
};

window.resetCounter = () => {
  frost.setState({ counter: 0 });
};

window.load = () => {
  console.log("loaded");
};

window.mouseOva = () => {
  console.log("mouse over");
};

const rootElement = document.getElementById("app");
if (rootElement) {
  frost.render(frost.parseDOM(rootElement) as VNode, rootElement);

  frost.setState({ name: "frost" });
}
