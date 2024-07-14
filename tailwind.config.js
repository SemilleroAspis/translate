/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto Flex"', 'sans-serif'],
      },
      colors: {
        custom: {
          lightBlue: '#3EE1EA',
          lightGreen: '#CEECB7',
          green: '#61E14D',
          blue: '#3160D2',
          pink: '#C84CC6',
          darkGreen: '#216A40',
          blueGray: '#39487B',
          purple: '#372C5A',
          darkPurple: '#623D58',
          darkBlue: '#21192F',
        }
      }
    }
  },
  plugins: [],
}
