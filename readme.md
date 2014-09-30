# Lonely Planet Tech Test

Please refactor the code in `src/app.js`.

We have added some tests to help you get started. They can be found in `test/app-spec.js` but are far from complete.

It's a highly conditional and guarded piece of code, without tests, though it is well commented. There is a lot of potential for making this piece of code simple and understandable.

===========================
## Directions to get started
- Fork this repository
- Make your changes
- Submit a Pull Request

===========================
## Running the tests
```
$ grunt
$ grunt watch
```

## Background

This piece of code is originally designed to track values in the query string of referrer urls. In it's simplest form, it is a function which accepts a url and returns an object. The parsing of the url has been somewhat abstracted for you into the parseUri lib, though you by no means have to keep using it.

Feel free to change the testing library from jasmine to something else if you prefer. Whatever you feel most comfortable with. The idea is that eventually you have a maintainable and tested piece of code, which hopefully is also a lot lighter.


## What we hope for

We are looking for a full test suite to complement a simplified and refactored piece of JavaScript.

This code can look daunting and incomprehensible to begin with, particularly without tests. If you tackle this problem by beginning with the tests, and then refactor, you should be able to find ways to decrease the overall amount of code required.

Ultimately, you should be left with code which is clear and concise, as well as a test suite which describes the code and replaces many, if not all, of the comments.
