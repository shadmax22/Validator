# KEY-VALIDATOR

Make validation easy and fast.

## Installation

```
  npm i key-validator
```

## Import

```

  import Validator from "key-validator"

  let V = Validator(...);

```

## Working

Validator function works in 2 steps:-

1. First it digs all sub keys and verifies weather it is null or "".
2. Validating as per user inputs.

## Usage

```
let colors = {
      redish: ["crimson", "orange"],
      greenish: ["yellow", "limegreen", ""],
      blackish: "",
      }

console.log(Validator({
    data: colors
})

```

### OUTPUT Will be:-

```
{
    stat: false
    errors: [
        0: "greenish['2']"
        1: "blackish"
    ]
    msg: {
    }
}

```

Explanation:-

1. `stat = true | false`, Returns validation status.
2. `errors = []`, Having path of keys that is `undefined || null || "" || key.length == 0`
3. `msg = []`, Will show messages defined by user on caught error in particular keys.

## Full-Fledged features example:

Here we have a `Object Details`:-

```
let Details = {
  name: {
    firstName: "John",
    middleName: "",
    lastName: "Doe",
  },
  age: 22,
  location: {
    country: "India",
    city: "New Delhi",
    streets: "Lorem porem impson",
  },
  sibilings: [],
};




```

### TEST 1

```
  Validator({
    data: Details,
    ignore: ["name.middleName"],
    rules: {
      age: (value) => {
        return [value > 28, "AGE NOT VALID "];
      },
    },
  });

```

#### OUTPUT WILL BE:-

```

{
    stat: false
    errors: {
        0: age
        1: sibilings
    }
    msg: {
        0: AGE NOT VALID
    }
}


```

### TEST 2

```
  Validator({
    data: Details,
    ignore: ["name.middleName", "sibilings"],
    rules: {
      age: (value) => {
        return [value > 28, "AGE NOT VALID "];
      },
    },
  });

```

#### OUTPUT WILL BE:-

```

{
    stat: false
    errors: {
        0: age
    }
    msg: {
        0: AGE NOT VALID
    }
}


```

## METHODS :-

1. `data` => Main object that to be validated.
2. `ignore = [...]` => Specify key that to be ignored.
3. `required = [...]` => Only specifed key will be validated and remaining will be ignored.
4. `rules = {keyname: (value)=>[STAT, ERROR_MESSAGE]}` => Each keys will be validated with function and must return `[STAT, ERROR_MESSAGE]` to validate.
