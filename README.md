# Making Layer Cakes

Helpers for class/traits-like composition of objects-as-closures

## The Objects-as-closures Pattern

The classic object or object-oriented programming has public methods and private instance variables. There are several ways to encode this in JavaScript. The following code uses JavaScript's class syntax with the [new support for private instance variables](https://github.com/tc39/proposal-class-fields#private-fields).

```js
class Point {
  #x, #y;
  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }
  getX() { return this.#x; }
  getY() { return this.#y; }
  toString() { return `<${this.getX()},${this.getY()}>`; }
}
```

The class syntax above is approximately syntactic sugar for the following pattern in terms of constructor functions, prototype inheritance, and WeakMaps.

```js
const privX = new WeakMap();
const privY = new WeakMap();
function Point(x, y) {
  privX.set(this, x);
  privY.set(this, y);
}
Point.prototype = {
  getX() { return privX.get(this); },
  getY() { return privY.get(this); },
  toString() { return `<${this.getX()},${this.getY()}>`; }
}
```

Finally, there is the objects-as-closure pattern

```js
function makePoint(x, y) {
  const self = {
    getX() { return x; },
    getY() { return y; },
    toString() { return `<${self.getX()},${self.getY()}>`; }
  };
  return self;
}
```

To write defensive objects in JavaScript, we recommend the objects-as-closures pattern over either classes or prototype inheritance. The objects-as-closure pattern makes no use of `this` or prototype inheritance. The captured lexical variables, such as `x` and `y` above, serve as the private instance variables. The object's public properties are the closures that capture these variables, and serve as the methods of the object. Rather than a magical `this`, self reference is arranged merely by defining another normal lexical variable to be captured by methods such as the `toString` method shown above.

## Inheritance as Layer Combination

A common feature of many object systems is some kind of layer-combination mechanism, such as class-style inheritance or trait combination. Classes support inheritance straightforwardly. We illustrate with the WobblyPoint example.

```js
class WobblyPoint extends Point {
  #wobble;
  constructor(x, y, wobble) {
    super(x, y);
    this.#wobble = wobble;
  }
  getX() { return super.getX() + this.#wobble++; }
}
```

The `WobblyPoint` example demonstrates the features of class inheritance, where subclasses can override methods of superclasses, `this`-based dispatch in the superclass invokes the overriding methods, and `super`-based dispatch in the subclass invokes the overridden method.

The wobbly point instances created by the `WobblyPoint` constructor above are each made of two layers: One expressed directly by the `Point` class, and one expressed directly by the `WobbyPoint` class. The *layer-cake* library provided by this repository supports such layer combination for the objects-as-closure pattern.

```js
function BasePointLayer(x, y) {
  return self => {
    getX() { return x; },
    getY() { return y; },
    toString() { return `<${self.getX()},${self.getY()}>`; },
  };
}

function WobblyPointLayer(wobble) {
  return (_self, supr) => {
    getX() { return supr.getX() + wobble++; },
  };
}

function makeWobblyPoint(x, y, wobble) {
  return makeClassCake([BasePointLayer(x, y), WobblyPointLayer(wobble)]);
}
```

The pattern above has more of the flexibility associated with traits or mixins. Each layer is expressed separately. The layers are then combined by a distinct maker function `makeWobblyPoint`. Different making functions can combine overlapping sets of layers in different manners.

The list of layers given to `makeClassCake` is in order from super-class-like to subclass-like. This enables each layer to also bind a `supr` variable to serve a function analogous to the `super` keyword supported by classes. The `supr` variable is bound to a combination of all layers above (to the left of) the given layer.

## Class-like vs Trait-like Layer Combination

This repository also exports a `makeTraitCake` providing a simple form of trait combination. Trait combination is a non-hierarchical alternative to class inheritance. Each trait defines a separate layer as above. But the methods defined by each layer must be disjoint. This simple form of trait combination does not support any form of override or renaming. The corresponding example

```js
function AbstractPointLayer(x, y) {
  return self => {
    baseGetX() { return x; },
    getY() { return y; },
    toString() { return `<${self.getX()},${self.getY()}>`; },
  };
}

function WobblyPointLayer(wobble) {
  return self => {
    getX() { return self.baseGetX() + wobble++; },
  };
}

function makeWobblyPoint(x, y, wobble) {
  return makeTraitCake([AbstractPointLayer(x, y), WobblyPointLayer(wobble)]);
}
```

Variants of these examples are found in the test cases of this repository.

# References

[TraitsJS](https://traitsjs.github.io/traits.js-website/) is an earlier ES5-based traits library for the objects-as-closure pattern that is more full featured. It is explained at [traits.js:
Robust Object Composition and High-integrity Objects for ECMAScript 5](https://traitsjs.github.io/traits.js-website/files/traitsJS_PLASTIC2011_final.pdf). It uses `this` to solve the self-reference problem.
