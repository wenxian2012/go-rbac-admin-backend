module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-var": "error",
    "no-console": "off",
    "camelcase": "off",
    "no-extra-boolean-cast": "off",
    "no-unused-vars": "off",
    "semi": ["error", "always"],
    "vue/no-v-html": "off",
    "vue/require-prop-types": "off",
    "vue/require-default-prop": "off",
    "vue/no-reserved-keys": "off",
    "vue/prop-name-casing": "off",
    "vue/attribute-hyphenation": "off",
    "vue/max-attributes-per-line": [
      2,
      {
        "singleline": 20,
        "multiline": {
          "max": 1,
          "allowFirstLine": false
        }
      }
    ]
  }
};
