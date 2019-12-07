const {
  create: objCreate,
  getOwnPropertyDescriptors: gopds,
  defineProperties,
  prototype: objPrototype,
  freeze,
} = Object;

function makeCakeMaker(combineLayers) {
  return function makeCake(layerFuns) {
    const finalObject = {};
    const suprs = []
    
    for(const layerFun of layerFuns){
      const supr = suprs[suprs.length - 1];
      combineLayers(finalObject, layerFun(finalObject, supr));
      const nextSupr = objCreate(objPrototype, gopds(finalObject))
      suprs.push(nextSupr)
    }
    
    return finalObject;
  };
}

// The additionalLayer overrides existing layers
const makeClassCake = makeCakeMaker((objectInConstruction, additionalLayer = {}) =>
  defineProperties(objectInConstruction, gopds({...additionalLayer}))
);

// The layers must be disjoint
const makeTraitCake = makeCakeMaker((objectInConstruction, additionalLayer = {}) => {
  defineProperties(objectInConstruction, gopds(freeze({ ...additionalLayer })));
});

export { makeCakeMaker, makeClassCake, makeTraitCake };
