# angular-resource-service
This is some generic code I have been working on for managing Angular Resource cache, using node and socket.io (it could be replaced with whatever you wanted) 



In my standard files I declare my module in it's own file, then bring in the cacheResource Utility, the Instances are dependent on the Utility, and finally the controler, which is dependent on the Instances.
<pre><code><xmp>
<script src="js/ModuleDeclaration.js"></script>
<script src="js/CacheResourceUtility.js"></script>
<script src="js/CacheResourceInstances.js"></script>
<script src="js/YourController.js"></script>
</xmp></code></pre>

When getting an initial list you shuold get only the Id's and then run individual Get/Id requests to enjoy the automatic cache clearing features. When an automatic update occurs it will triger the message with the name of the resource Instance ('One', 'Two', or 'Three') for our example.

<pre><code><xmp>
//This event is triggered when the cache is cleared fo an object of this type 
$scope.$on('One', function() {
      //call a function to refresh whatever is needed. Check out the CacheRefreshUtility for a simple way to do this
});
</xmp></code></pre>

If a user saves a new item that I wish to add to other clients in real time then I create a seperate Socket.io listener and send the ID to be added to the page.
