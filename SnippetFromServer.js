...

//Set up the main namespaces and rooms
var cachedResourceSocket = io.of('/cachedResource');
cachedResourceSocket.on('connection', function(socket)
{
	socket.on('JoinRoom', function(room)
	{
		socket.join(room);
	});
	
	socket.on('ValueChanged', function(data)
	{
		if(data.room)
		{
			cachedResourceSocket.in(data.room).emit('ValueChanged', data.msg);
		}
		else
		{
			cachedResourceSocket.emit('ValueChanged', data);
		}
	});
});

...
