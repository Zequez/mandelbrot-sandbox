// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.js", "./src/**/*.tsx"],
  theme: {},
  variants: {},
  // https://github.com/tailwindcss/custom-forms
  plugins: [],
};
