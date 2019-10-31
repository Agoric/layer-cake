const {
  create: objCreate,
  getOwnPropertyDescriptors: gopds,
  prototype: objPrototype,
  freeze,
  assign,
} = Object;

function makeCakeMaker(combineLayers) {
  return function makeCake(layerGens) {
    let self;
    const suprs = layerGens.map(layerGen => {
      const supr = self;
      const layer = layerGen.next().value;
      // ... order? disjoint? requiredHoles?
      self = combineLayers(self, layer);
      return supr;
    });
    layerGens.forEach((layerGen, i) => {
      layerGen.next([self, suprs[i]]);
    });
    return self;
  };
}

// The lower layer overrides the upper layer
const makeClassCake = makeCakeMaker((upper, lower) => ({ ...upper, ...lower }));

// The layers must be disjoint
const makeTraitCake = makeCakeMaker((upper, lower) => {
  const result = objCreate(objPrototype, gopds(freeze({...upper})));
  return assign(result, lower);
});

export { makeCakeMaker, makeClassCake, makeTraitCake };
