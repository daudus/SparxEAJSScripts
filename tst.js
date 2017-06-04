 
 function Context () {
	this.config = {PROP1:"ahoj",PROP2:"cau"};
	this.txt = "text";
 }
 
 
function main()
{
	ctx = new Context();
	WScript.Echo(ctx.txt);
	
	var sum = [0, 1, 2, 3].reduce(function(acc, val) {
		return acc + val;
	}, 0);
	WScript.Echo(sum);
}

main();