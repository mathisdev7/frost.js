# **Frost.js** ❄️

![logo](https://i.ibb.co/DPZzZTFS/icon.png)

**Frost.js** is a minimal, React-like JavaScript library created for learning the core concepts behind modern frontend frameworks. It focuses on exploring **Virtual DOM**, **rendering**, and **state management** from scratch.

## **Features**

- **Virtual DOM**: Efficiently manage and update the UI.
- **Rendering**: Convert virtual DOM nodes into real DOM elements.
- **Props Handling**: Pass properties to components.
- **State Management**: Supports dynamic updates without re-rendering the full DOM.
- **Template Syntax**: Bind state variables in the DOM using `{{state}}` placeholders.

## **Installation**

Clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/mathisdev7/frost.js
cd frost.js
```

No dependencies for now. Just include **frost.js** directly in your HTML for testing purposes.

## **Usage**

Example of creating and rendering a simple component with state binding:

```js
const frost = new Frost();
const rootElement = document.getElementById("app");
if (rootElement) {
  frost.render(frost.parseDOM(rootElement), rootElement);

  setTimeout(() => {
    frost.setState({ counter: frost.state.counter + 1 });
  }, 2000);

  setTimeout(() => {
    frost.setState({ counter: frost.state.counter + 1 });
  }, 4000);
}
```

This will automatically update text nodes containing `{{counter}}` in the DOM.

## **Contributing**

Feel free to contribute by creating issues or submitting pull requests. This project is designed for learning, and all improvements or suggestions are welcome!

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

