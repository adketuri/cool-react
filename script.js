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

let nextUnitOfWork = null;

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

function createDom(fiber) {
  // recursively render the fiber and its children
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // assign the element props to our node
  const isProp = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProp)
    .forEach((name) => (dom[name] = fiber.props[name]));
  return dom;
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop); // setTimeout-like, runs when main is idle
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  // for each child elem, create a fiber
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // add to the fiber tree, setting it as either a child or sibling
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  // search for the next unit of work
  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
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
    <h1>very important website</h1>
    <p id="p">I get to see my daddy on july 14th</p>
    <img src="public/cameron-poe.gif" />
  </div>
);

const container = document.getElementById("root");
CoolReact.render(element, container);
