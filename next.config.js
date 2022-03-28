/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: process.env.BASE_PATH || "",
  env: {
    BASE_PATH: process.env.BASE_PATH || "",
  }
}
