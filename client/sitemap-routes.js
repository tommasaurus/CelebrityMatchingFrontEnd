// sitemap-routes.js

const { Sitemap } = require('react-router-sitemap');

const routes = [
  {
    path: '/',
    priority: 1.0,
  },
  {
    path: '/contact',
    priority: 0.8,
  },
  {
    path: '/scroll',
    priority: 0.7,
  },
  {
    path: '/privacy-policy',
    priority: 0.5,
  },
  {
    path: '/terms-of-service',
    priority: 0.5,
  },
];

module.exports = routes;
