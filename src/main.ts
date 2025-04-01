interface VNode {
  type: string;
  props: Record<string, any>;
  children: (VNode | string)[];
}

class Frost {
  private vDOM: VNode | null;
  private root: HTMLElement | null;

  constructor() {
    this.vDOM = null;
    this.root = null;
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
    this.renderElement(this.vDOM, this.root);
  }

  /**
   * convert vnode to a real dom element that can be attached to root element
   * @param vDOM - virtual dom node to convert
   * @param root - root element
   */
  private renderElement(vDOM: VNode, root: HTMLElement) {
    const el = document.createElement(vDOM.type);
    if (vDOM.props) {
      for (const [key, value] of Object.entries(vDOM.props))
        el.setAttribute(key, value);
    }
    for (const children of vDOM.children) {
      if (typeof children === "string") {
        el.append(document.createTextNode(children));
      } else {
        this.renderElement(children, el);
      }
    }
    root.appendChild(el);
  }
}

const frost = new Frost();
const vnode: VNode = {
  type: "div",
  props: { id: "justtext" },
  children: [{ type: "span", props: { id: "justspan" }, children: ["bjr"] }],
};
const el = frost.createElement(vnode.type, vnode.props, ...vnode.children);

const rootElement = document.getElementById("app");
if (rootElement) {
  frost.render(el, rootElement);
}
