[MD Editing Syntax](https://guides.github.com/features/mastering-markdown/)

# SparxEAJSScripts

- [Introducing JScript .NET](http://msdn.microsoft.com/en-us/library/ms974588.aspx)
- [EA Reference](http://www.sparxsystems.com/enterprise_architect_user_guide/10/automation_and_scripting/reference.html)
- Development tool: [Microsoft Visual Studio Code](https://code.visualstudio.com/download)
- Development Runtime: [Microsoft CScript](https://technet.microsoft.com/en-us/library/bb490887.aspx)
- [Bacic conceptual Architecture](https://www.flickr.com/photos/daudus/shares/9174Gn)


## Purpose

## Usage
- open EA model with some writable package P
- Install all scripts into HuMaInn package within Sparx EA (create this package if necessary. See bellow the structure of scripts)
- select some element E within package P
- run script ia
- within package P there will be new diagram created with name "iagen_"+P
- all elements from package P together with relations will be in diagram (based on parameter MAXIMUM_DEPTH)

## Structure of scripts

```
`\---HuMaInn`
           diagram.js
           ea_utils.js
           ia.js :+1:
           ia_globals.js
           `\---test`
                      test_diagram.js
                      test_env.js
                      test_graph.js
```

- ia.js is the main runnable script.
- directory test contains "unit tests" like scripts
