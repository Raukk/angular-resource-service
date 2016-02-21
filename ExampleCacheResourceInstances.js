module.service('One', function (CachedResource) {
    return new CachedResource().build('One', '/api/One/:_id');
});

module.service('Two', function (CachedResource) {
    return new CachedResource().build('Two', '/api/Two/:_id');
});

module.service('Three', function (CachedResource) {
    return new CachedResource().build('Three', '/api/Three/:_id');
});
