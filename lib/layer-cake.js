

function makeCake(layerGens) {
  let self = undefined;
  const suprs = layerGens.map(layerGen => {
    const supr = self;
    const layer = layerGen.next().value;
    // ... order? disjoint? requiredHoles?
    self = {...self, ...layer};
    return supr;
  });
  layerGens.forEach((layerGen, i) => {
    layerGen.next([self, suprs[i]]);
  });
  return self;
}

export { makeCake };
