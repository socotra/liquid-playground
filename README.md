# Socotra Liquid Playground

A web app for testing and debugging your Socotra Liquid Calculations.
[Jump to the app!](http://s3.amazonaws.com/socotra.wb/liquid-playground/index.html)

[Open an issue](https://github.com/socotra/liquid-playground/issues/new)
to record ideas, feature suggestions, and bugs.

## Development

### Follow these conventions

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Changelog](https://keepachangelog.com/en/1.0.0/)
- [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
- [JSDoc-style Comments](https://jsdoc.app/index.html)

### Setup

```shell script
npm install -g @vue/cli         # Globally install Vue Cli which manages the project.
npm install                     # Then install all project requirements as usual.
```

### NPM Commands

```shell script
npm run serve                   # Serve up the app locally while developing!
npm run lint                    # Check the project for errors
npm run build                   # Compile and minify for production
npm run serve-built-at-root     # Serve the built project to test the built files
npm run serve-built-at-subpath  # Serve the built project to test hosting at a subpath
npm run deploy                  # Deploy the built project to AWS S3
```

### Release

- update `CHANGELOG.md` with new release section
- update version number in `package.json`
- update user-facing version number listed in `App.vue`
- finish all commits, merge `feature -> develop -> master`
- tag the commit representing the release with version number
  prepended with 'v', e.g. v1.0.0 and push the tag to origin
- build and deploy to `<s3>/policy-explorer/v<versionNumber>`
  and to `<s3>/policy-explorer` (meddle with the `deployPath`
  property in `vue.config.js`)
- head to GitHub > releases and add/edit the release associated
  with the version tag, paste in the new release section from
  `CHANGELOG.md`

### Helpful Reference

- [Vue CLI Configuration](https://cli.vuejs.org/config/)
- [Vuetify Components](https://vuetifyjs.com/en/components/api-explorer/)

## Recreate this Project

### Install Vue Cli

Globally (`-g`), so that you can use it easily on the command line.

```shell script
npm install -g @vue/cli
```

### Initialize a new Vue app

```shell script
vue create liquid-playground
```

Choose default options.

### Add [Prettier](https://prettier.io/)

Use Prettier to reformat files to get consistent code format and style.

```shell script
npm install --save-dev --save-exact prettier
```

Use `--save-exact` to only upgrade `prettier` intentionally, because minor upgrades may reformat your code after you already committed well-formatted code.

#### Enable reformat-on-save in WebStorm

`Preferences > Languages & Frameworks > Javascript > Prettier > Run on Save for Files`

Use a glob pattern like this to specify which files:

`{**/*,*}.{js,ts,jsx,tsx,md,json,html,vue}`

### Add [ESLint](https://vuejs.github.io/eslint-plugin-vue/user-guide/)

Use ESLint to warn about and enforce code quality and style issues.

```shell script
vue add eslint
```

choose options:

- Prettier rules
- Lint on Save

#### Use Vue's recommended rules

Consider using Vue's `recommended` level of [rules](https://eslint.vuejs.org/rules/).
See below for what this looks like in `eslintrc.js`.

#### Add the [AirBnB Style Guide rules](https://github.com/airbnb/javascript):

This is a plugin to ESLint, giving ESLint many rules to apply.

```shell script
npm install --save-dev @vue/eslint-config-airbnb
```

Add them to your `.eslintrc.js`, see below for example.

#### Run the Prettier rules last

Make sure the Prettier rules (`"@vue/prettier"`) are placed after
other stylistic (rather than code-quality) rules, allowing them
to take precedence over other stylistic rules, most importantly
rules that give conflicting advice:

```js
// eslintrc.js
module.exports = {
  //...

  extends: [
    "eslint:recommended",
    "@vue/airbnb",
    "plugin:vue/recommended",
    "@vue/prettier",
  ],

  // ...
};
```

#### Add [linting for JSDoc Comments](https://github.com/gajus/eslint-plugin-jsdoc)

This is another ESlint plugin: eslint-plugin-jsdoc, providing rules
to check JSDoc comments for mismatched parameters or types, etc.

Assuming ESLint is installed as above, install the plugin:

```shell script
npm install --save-dev eslint-plugin-jsdoc
```

Add 'plugins' property to the exported object in your `.eslintrc.js`
file and specify `eslint-plugin-jsdoc` as a plugin.

```js
// eslintrc.js
module.exports = {
  // ...
  plugins: ["jsdoc"],
  // ...
};
```

Use the rules provided by this plugin by adding them to the `extends`
property, referring to this plugin as: `"plugin:jsdoc/recommended"`.
Keep Prettier at the end; mine looks like:

```js
// eslintrc.js
module.exports = {
  // ...
  extends: [
    "eslint:recommended",
    "@vue/airbnb",
    "plugin:vue/recommended",
    "plugin:jsdoc/recommended",
    "@vue/prettier",
  ],
  // ...
};
```

### Add [Vuetify](https://vuetifyjs.com/en/getting-started/quick-start/)

Adds visual and reactive Vue components;
also adds style and layout helpers.

```shell script
vue add vuetify
```

Choose defaults options.

#### Add [Vuetify ESLint plugin](https://github.com/vuetifyjs/eslint-plugin-vuetify)

A plugin for ESLint that will steer you away from deprecated use of Vuetify.

```shell script
npm install eslint-plugin-vuetify --save-dev
```

Update `eslintrc.js`:

```js
// .eslintrc.js
module.exports = {
  plugins: ["vuetify"],
  rules: {
    "vuetify/grid-unknown-attributes": "error",
    "vuetify/no-deprecated-classes": "error",
    "vuetify/no-legacy-grid": "error",
  },
};
```

You can test that it works by adding, for example, a `v-layout` Vue
component to one of your Vue templates.

```html
<v-app>
  <v-layout />
  <!--...-->
</v-app>
```

ESLint should throw an error,
stating: `ESLint: 'v-layout' has been replaced with 'v-row'(vuetify/no-legacy-grid)`

### Add [vue-cli-plugin-s3-deploy](https://github.com/multiplegeorges/vue-cli-plugin-s3-deploy)

For deployment of this web app to AWS S3 which serves the app.

```shell script
vue add s3-deploy
```

I chose all defaults except:

- where in the bucket (deployPath): liquid-playground

#### Configure your AWS credentials file

In order to upload to AWS S3, the s3-deploy plugin needs to be able to use your AWS shell credentials.

It will look in `~/.aws/credentials`, which should look like this:

```
#~/.aws/credentials
[default]
aws_access_key_id = Z17AIT6KDJJD1IUOUEIR
aws_secret_access_key = XHakkwO8IUtFUDFKQfE2qs4poiukD3IxzlLKJi11
```

If you like, you can use the AWS-CLI ([install](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
to set that up.

Then configure it (which will create your credentials file)

```shell script
aws configure
```
