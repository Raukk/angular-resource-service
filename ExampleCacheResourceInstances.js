module.service('User', function (CachedResource) {
    return new CachedResource().build('User', '/api/User/:_id');
});

module.service('ChatMessage', function (CachedResource) {
    return new CachedResource().build('ChatMessage', '/api/ChatMessage/:_id');
});

module.service('Author', function (CachedResource) {
    return new CachedResource().build('Author', '/api/Author/:_id');
});
