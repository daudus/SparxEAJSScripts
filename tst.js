 
 function Context () {
	this.config = {PROP1:"ahoj",PROP2:"cau"};
	this.txt = "text";

	this.innerClass = function InnerClass () {
		this.prpt = "prop";
	}
 }
 
 
function main()
{
	ctx = new Context();
	innerClass = new ctx.innerClass();

	WScript.Echo(innerClass.prpt);
}

main();