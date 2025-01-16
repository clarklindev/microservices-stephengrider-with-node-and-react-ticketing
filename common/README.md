NOTE: in the course, stephen leaves the common shared library inside the main project folder: `section05-19-ticketing/common/`
but it is then a submodule, main project wont track this as it will have its own version control.
- i have moved common/ repository, it is referenced from externalized repo as npm package: `@clarklindev/common`
- the repo: [https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git](https://github.com/clarklindev/microservices-stephengrider-with-node-and-react-common.git)