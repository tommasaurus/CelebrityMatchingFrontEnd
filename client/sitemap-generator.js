// sitemap-generator.js

const Sitemap = require('react-router-sitemap').default;
const routes = require('./sitemap-routes');

function generateSitemap() {
  const sitemap = new Sitemap(routes)
    .build('https://www.onlyfacefinder.com')
    .save('./public/sitemap.xml');

  return sitemap;
}

generateSitemap();
