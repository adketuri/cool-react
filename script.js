/** @jsxRuntime classic */

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((c) =>
        typeof c === "object" ? c : createTextElement(c)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  // recursively render the element and its children
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // assign the element props to our node
  const isProp = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProp)
    .forEach((name) => (dom[name] = element.props[name]));

  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

const CoolReact = {
  createElement,
  render,
};

// const element = CoolReact.createElement(
//   "div",
//   { id: "foo" },
//   CoolReact.createElement("h1", { id: "inner-h1" }, "inner h1"),
//   CoolReact.createElement("p", { id: "some-p" }, "imma p")
// );
/* @jsx CoolReact.createElement */
const element = (
  <div id="foo">
    <h1>hello h1</h1>
    <p id="p">imma p</p>
  </div>
);

const container = document.getElementById("root");
CoolReact.render(element, container);
