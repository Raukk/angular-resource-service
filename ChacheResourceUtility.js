//base code from http://stackoverflow.com/questions/25117388/invalidate-resource-cache-after-post-request
//I have modified it a lot but the source code is still quite brilliant
module.factory('CachedResource', function ($rootScope, $resource, $cacheFactory)
{
	return function()
	{	
		//Queries are not ever cached because they would always be invalid (due to changes) therefore Queries are only used to pull in ids
		var self = this;

		self.setup = function(resourceName)
		{
			self.socketRoom = resourceName;
			self.cache = $cacheFactory(resourceName);
			var oldPut = self.cache.put;
			self.cache.put = function(key, val)
			{
				if(!self.cache.get(key))
				{
					self.socket.emit('JoinRoom', key);    
					oldPut(key, val);
				}				
			}
		};

		self.ValueChanged = function (resourceString)
		{	
			if(self.cache.get(resourceString)){
				self.cache.remove(resourceString);
				console.log('cache removed:', resourceString);
				
				//broadcast that something changes in this resource
				$rootScope.$broadcast(self.socketRoom);
			}
		};
		
		//For socket.io the instantiation is pretty simple.
		self.socket = io('/cachedResource');
		self.socket.on('ValueChanged',  function (msg)
		{
			self.ValueChanged(msg);
		});	

		self.interceptor =
		{
			response: function (response)
			{
				var resourceString = response.config.url;
				
				self.socket.emit('ValueChanged', {'room' : resourceString, 'msg' : resourceString});
				
				return response;
			}
		};

		self.build = function (name, url, paramDefaults, actions, options)
		{
			self.setup(name);			
			
			actions = angular.extend({}, actions,
				{
				'get': { method: 'GET', cache: self.cache },
				'save': { method: 'POST', interceptor: self.interceptor },
				'update': { method: 'PUT', interceptor: self.interceptor },
				'delete': { method: 'DELETE', interceptor: self.interceptor },
				'query': { method: 'GET', isArray: true }
				});			
			
			return $resource(url, paramDefaults, actions, options);
		};
		
		return self;
	}
});
	
//Utility code, I reallized I was going to have to write this code a lot, so I made it reuseable
module.factory('CacheRefreshUtility', function ()
{
	return function(listToUpdate, cacheResourceService, chainDependencies)
	{ 
		//loop through each one in the list and refresh it, the cache should do most/all of the work
		var rebuild = [];
		
		angular.forEach(listToUpdate, function (oldValue)
		{
			if(oldValue._id)
			{
				var newValue = cacheResourceService.get({'_id' : oldValue._id}, function()
				{
					if(newValue)
					{
						rebuild.push(newValue);	
						if(chainDependencies)
						{
							chainDependencies(newValue);
						}
					}
				});
			}
			else
			{
				//this assumes that it is just a list of ids
				var newValue = cacheResourceService.get({'_id' : oldValue}, function()
				{
					if(newValue)
					{
						rebuild.push(newValue);	
						if(chainDependencies)
						{
							chainDependencies(newValue);
						}
					}
				});
			}
		});
		
		return rebuild;
	};
});
