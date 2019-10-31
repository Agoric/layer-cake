import test from 'tape';
import harden from '@agoric/harden';
import { makeClassCake } from '../lib/layer-cake';

test('cajita-wobbly-point-class test', t => {
  try {
    function* BasePointLayer(x, y) {
      const [self] = yield {
        getX() {
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
      const [_self, supr] = yield {
        getX() {
          // eslint-disable-next-line no-plusplus
          return supr.getX() + wobble++;
        },
      };
    }

    function WobblyPoint(x, y, wobble) {
      return makeClassCake([BasePointLayer(x, y), WobblyPointLayer(wobble)]);
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

test('hardened-wobbly-point-class test', t => {
  try {
    function* BasePointLayer(x, y) {
      const [self] = harden(
        yield harden({
          getX() {
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
    harden(BasePointLayer);

    function* WobblyPointLayer(wobble) {
      const [_self, supr] = harden(
        yield harden({
          getX() {
            // eslint-disable-next-line no-plusplus
            return supr.getX() + wobble++;
          },
        }),
      );
    }
    harden(WobblyPointLayer);

    function WobblyPoint(x, y, wobble) {
      return makeClassCake(
        harden([BasePointLayer(x, y), WobblyPointLayer(wobble)]),
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
