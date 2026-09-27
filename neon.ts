import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  functions: {
    hello: { name: "Hello World", source: "./hello.ts" },
  },  
  preview: {
    buckets: {
      uploads: { access: "private" },
    },
  },
});
