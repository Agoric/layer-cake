import test from 'tape';
import harden from '@agoric/harden';
import { makeTraitCake } from '../lib/layer-cake';

test('cajita-wobbly-point-trait test', t => {
  try {
    function* AbstractPointLayer(x, y) {
      const [self] = yield {
        baseGetX() {
          return x;
        },
        getY() {
          return y;
        },
        toString() {
          return `<${self.getX()},${self.getY()}>`;
        },
      };
    }

    function* WobblyPointLayer(wobble) {
      const [self] = yield {
        getX() {
          // eslint-disable-next-line no-plusplus
          return self.baseGetX() + wobble++;
        },
      };
    }

    function WobblyPoint(x, y, wobble) {
      return makeTraitCake([AbstractPointLayer(x, y), WobblyPointLayer(wobble)]);
    }

    const wp1 = WobblyPoint(3, 5, 0.1);
    const wp2 = WobblyPoint(3, 5, 0.1);

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
    function* AbstractPointLayer(x, y) {
      const [self] = harden(
        yield harden({
          baseGetX() {
            return x;
          },
          getY() {
            return y;
          },
          toString() {
            return `<${self.getX()},${self.getY()}>`;
          },
        }),
      );
    }
    harden(AbstractPointLayer);

    function* WobblyPointLayer(wobble) {
      const [self] = harden(
        yield harden({
          getX() {
            // eslint-disable-next-line no-plusplus
            return self.baseGetX() + wobble++;
          },
        }),
      );
    }
    harden(WobblyPointLayer);

    function WobblyPoint(x, y, wobble) {
      return makeTraitCake(
        harden([AbstractPointLayer(x, y), WobblyPointLayer(wobble)]),
      );
    }

    const wp1 = WobblyPoint(3, 5, 0.1);
    const wp2 = WobblyPoint(3, 5, 0.1);

    t.equal(`${wp1}`, '<3.1,5>');
    t.equal(`${wp1}`, '<4.1,5>');
    t.equal(`${wp2}`, '<3.1,5>');
  } catch (e) {
    t.isNot(e, e, 'unexpected exception');
  } finally {
    t.end();
  }
});
