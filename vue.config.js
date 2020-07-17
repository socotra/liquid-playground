module.exports = {
  transpileDependencies: ["vuetify"],

  // relative paths: So that the built project can be served from a path other than root
  publicPath: "",

  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: "default",
      overrideEndpoint: false,
      region: "us-east-1",
      bucket: "socotra.wb",
      createBucket: true,
      staticHosting: true,
      staticIndexPage: "index.html",
      staticErrorPage: "index.html",
      assetPath: "dist",
      assetMatch: "**",
      deployPath: "liquid-playground",
      acl: "public-read",
      pwa: false,
      enableCloudfront: false,
      pluginVersion: "4.0.0-rc3",
      uploadConcurrency: 5,
    },
  },
};
