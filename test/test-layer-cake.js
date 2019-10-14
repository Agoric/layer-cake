import test from 'tape';
import harden from '@agoric/harden';
import { makeCake } from '../lib/layer-cake';

const shouldBeHarden = Object.freeze;

test('cajita-wobbly-point test', t => {
  try {

    function* BasePointLayer(x, y) {
      const [self] = yield {
        getX() { return x; },
        getY() { return y; },
        toString() { return `<${self.getX()},${self.getY()}>`; },
      };
    }

    function* WobblyPointLayer(wobble) {
      const [self, supr] = yield {
        getX() { return supr.getX() + wobble++; },
      };
    }

    function WobblyPoint(x, y, wobble) {
      return makeCake([
        BasePointLayer(x, y),
        WobblyPointLayer(wobble)
      ]);
    }

    const wp1 = WobblyPoint(3, 5, 0.1);
    const wp2 = WobblyPoint(3, 5, 0.1);

    t.equal(''+wp1, '<3.1,5>');
    t.equal(''+wp1, '<4.1,5>');
    t.equal(''+wp2, '<3.1,5>');

  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  } finally {
    t.end();
  }
});

test('hardened-wobbly-point test', t => {
  try {

    function* BasePointLayer(x, y) {
      const [self] = harden(yield harden({
        getX() { return x; },
        getY() { return y; },
        toString() { return `<${self.getX()},${self.getY()}>`; },
      }));
    }

    function* WobblyPointLayer(wobble) {
      const [self, supr] = harden(yield harden({
        getX() { return supr.getX() + wobble++; },
      }));
    }

    function WobblyPoint(x, y, wobble) {
      return makeCake(shouldBeHarden([
        BasePointLayer(x, y),
        WobblyPointLayer(wobble)
      ]));
    }

    const wp1 = WobblyPoint(3, 5, 0.1);
    const wp2 = WobblyPoint(3, 5, 0.1);

    t.equal(''+wp1, '<3.1,5>');
    t.equal(''+wp1, '<4.1,5>');
    t.equal(''+wp2, '<3.1,5>');

  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  } finally {
    t.end();
  }
});
