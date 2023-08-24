import withMT from "@material-tailwind/react/utils/withMT";
import * as colors from 'tailwindcss/colors';

module.exports = withMT({
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "src/app/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      rotate: {
        '15': '15deg',
      }
    },
    colors: {
      battelfield_bg: '#6b6e6f',
      stack_bg: '#346e81',
      hand_bg: '#1f4c5b'
    }
  },
  plugins: [],
});
