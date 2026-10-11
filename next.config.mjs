import createMDX from "@next/mdx";

const withMDX = createMDX({});
export default withMDX({
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/bryan034/**",
        search: "",
      },
    ],
  },
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
});
