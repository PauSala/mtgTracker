import withMT from "@material-tailwind/react/utils/withMT";
import * as colors from 'tailwindcss/colors';

module.exports = withMT({
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "src/app/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
