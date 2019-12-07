import test from 'tape';
import harden from '@agoric/harden';
import { makeTraitCake } from '../lib/layer-cake';

test('cajita-wobbly-point-trait test', t => {
  try {
    function AbstractPointLayer(x, y) {
      return self => ({
        baseGetX() {
          return x;
        },
        getY() {
          return y;
        },
        toString() {
          return `<${self.getX()},${self.getY()}>`;
        },
      });
    }

    function WobblyPointLayer(wobble) {
      return self => ({
        getX() {
          // eslint-disable-next-line no-plusplus
          return self.baseGetX() + wobble++;
        },
      });
    }

    function makeWobblyPoint(x, y, wobble) {
      return makeTraitCake([
        AbstractPointLayer(x, y),
        WobblyPointLayer(wobble),
      ]);
    }

    const wp1 = makeWobblyPoint(3, 5, 0.1);
    const wp2 = makeWobblyPoint(3, 5, 0.1);

    t.equal(`${wp1}`, '<3.1,5>');
    t.equal(`${wp1}`, '<4.1,5>');
    t.equal(`${wp2}`, '<3.1,5>');
  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  } finally {
    t.end();
  }
});

test('hardened-wobbly-point-trait test', t => {
  try {
    function AbstractPointLayer(x, y) {
      return self => harden({
        baseGetX() {
          return x;
        },
        getY() {
          return y;
        },
        toString() {
          return `<${self.getX()},${self.getY()}>`;
        },
      });
    }
    harden(AbstractPointLayer);

    function WobblyPointLayer(wobble) {
      return self => harden({
        getX() {
          // eslint-disable-next-line no-plusplus
          return self.baseGetX() + wobble++;
        },
      });
    }
    harden(WobblyPointLayer);

    function makeWobblyPoint(x, y, wobble) {
      return makeTraitCake(
        harden([AbstractPointLayer(x, y), WobblyPointLayer(wobble)]),
      );
    }

    const wp1 = makeWobblyPoint(3, 5, 0.1);
    const wp2 = makeWobblyPoint(3, 5, 0.1);

    t.equal(`${wp1}`, '<3.1,5>');
    t.equal(`${wp1}`, '<4.1,5>');
    t.equal(`${wp2}`, '<3.1,5>');
  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  } finally {
    t.end();
  }
});
