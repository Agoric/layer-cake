# Contributing

Thank you!

## Contact

We use github issues for all bug reports: https://github.com/Agoric/layer-cake/issues

## Installing, Testing

You'll need Node.js version 11 or higher.

* git clone https://github.com/Agoric/layer-cake/
* yarn install
* yarn test

## Pull Requests

Before submitting a pull request, please:

* run `yarn test` and make sure all the unit tests pass
* run `yarn lint-fix` to reformat the code according to our
  `eslint` profile, and fix any complaints that it can't automatically
  correct

## Making a Release

* edit NEWS.md enumerating any user-visible changes
* make sure `yarn config set version-git-tag false` is the current
  setting
* `yarn version` (interactive) or `yarn version --major` or `yarn version --minor`
  * that changes `package.json`
  * and does NOT do a `git commit` and `git tag`
* `git commit -m "bump version"`
* `git tag -a v$VERSION -m "v$VERSION"`
* `yarn publish --access public`
* `yarn version prerelease --preid=dev`
* `git push`
* `git push --tags`

## Versioning

While between releases, we use a version of "X.Y.Z-dev", where "X.Y.(Z-1)"
was the previous release tag. This helps avoid confusion if/when people work
from a git checkout, so bug reports to not make it look like they were using
the previous tagged release.

To achieve this, after doing a release, we run `yarn version prerelease
--preid=dev` to modify the `package.json` and `package-lock.json` with
the new in-between version string.
