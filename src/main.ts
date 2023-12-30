export default function Validator(
  params: {
    data: string[];
    required: string[];
    ignore: string[];
    rules: any;
  } = {
    data: [],
    ignore: [],
    required: [],
    rules: [],
  }
): object {
  const ERRORS: string[] = [];
  const ERROR_MESSAGES: string[] = [];
  let { data, required, ignore, rules } = params;

  if (Object.keys(rules ?? []).length > 0) {
    Object.keys(rules)
      .filter((t) => !(ignore ?? []).includes(t))
      .map((key: string) => {
        const value = stringToObj(key, data);

        let RE = rules[key](value);

        if ((RE ?? 0).length == 2) {
          // debugger;
          if (RE[0] == false) {
            ERRORS.push(key);
            ERROR_MESSAGES.push(RE[1]);
          }
        } else {
          console.error(
            "Rules functions must return array length of 2 having [stat, errorMessage] format."
          );
        }
      });
  }

  switch (true) {
    case (required?.length ?? 0) > 0:
      interface Accumulator {
        stat: boolean;
        errors: String[];
        msg: String[];
      }

      let InitValue: Accumulator = {
        stat: true,
        errors: [...ERRORS],
        msg: ERROR_MESSAGES,
      };
      let R = required.reduce((init: any, e) => {
        if ((stringToObj(e, data) ?? "") == "" && !(ignore ?? []).includes(e)) {
          init.stat = false;
          if (!ERRORS.includes(e)) {
            init.errors.push(e);
          }

          return init;
        }
        return init;
      }, InitValue);

      return R;
      break;

    case (ignore?.length ?? 0) >= 0:
      let Validate: {
        stat: boolean;
        errors: string[];
      } = Dig(data);

      let ALL_ERRORS = [
        ...ERRORS,
        ...Validate.errors.filter((e) => !ERRORS.includes(e)),
      ].filter((e: any) => {
        return !(ignore ?? []).includes(e);
      });

      return {
        stat: ALL_ERRORS.length == 0,
        errors: ALL_ERRORS,
        msg: ERROR_MESSAGES,
      };
      break;
  }

  return [];
}

function Dig(
  obj: any,
  innerCall = false,
  BRANCH: string[] = [],
  DATA: {
    stat: boolean;
    errors: any[];
  } = { stat: true, errors: [] }
) {
  let Keys = Object.keys(obj);

  Keys.map((i): any => {
    let RecordError = (BRANCHES: string[][] | any[]) => {
      DATA.stat = false;

      // debugger;

      if (!innerCall) {
        DATA.errors.push(BRANCHES);
      } else {
        DATA.errors = BRANCHES;
      }
    };

    let THIS_OBJ = obj[i];

    // OLD BRANCH, CURRENT  BRANCH
    let BRANCHES = [...BRANCH, i];

    if (typeof THIS_OBJ == "object") {
      if (THIS_OBJ.length == 0) {
        RecordError(BRANCHES);
        return { stat: false, branch: BRANCHES };
      }
      const Res = Dig(THIS_OBJ, true, BRANCHES);

      if (Res.stat == false) {
        RecordError(Res.errors);
      }
      return Res;
    } else if (typeof THIS_OBJ == "string") {
      if (THIS_OBJ == "") {
        RecordError(BRANCHES);
        return { stat: false, branch: BRANCHES };
      } else {
        return { stat: true, branch: BRANCHES };
      }
    }
  });

  if (innerCall) {
    return { ...DATA };
  } else {
    return { ...DATA, errors: DATA.errors.map((i) => reversePath(i)) };
  }

  /*
      {
        green: {
          blue: ""
        }
      }


      error => A.B.C.D




  */
}

export function varDump(obj: any, depth = 1, maxDepth = 100) {
  if (depth > maxDepth) {
    return "[Max depth reached]";
  }

  if (typeof obj === "object") {
    let output = "{\n";
    for (let key in obj) {
      output +=
        " ".repeat(depth * 4) +
        key +
        ": " +
        varDump(obj[key], depth + 1) +
        "\n";
    }
    output += " ".repeat((depth - 1) * 4) + "}";
    return output;
  } else {
    return obj;
  }
}

function stringToObj(path: any, data: object) {
  const keysAndIndices = (path ?? "")
    .match(/(?<=\[)(.*?)(?=\])|[^.\[\]]+/g)
    .map((match: any) => match.replace(/^['"](.*)['"]$/, "$1"));

  const result = keysAndIndices.reduce((acc: any, keyOrIndex: any) => {
    if (acc && typeof acc === "object" && keyOrIndex in acc) {
      return acc[keyOrIndex];
    } else {
      return undefined;
    }
  }, data);

  return result;
}

function reversePath(keys: String[]): String {
  return keys.reduce((init: any, t, i) => {
    t = t.trim();

    if (t.includes(" ")) {
      return init + `['${t}']`;
    } else {
      return init + `${i > 0 ? "." : ""}${t}`;
    }
  }, "");
}

// console.log(
//   Validator({
//     data: {
//       green: "blue",
//       blue: "pink",
//       yellow: {
//         greenx: "",
//       },
//       pink: {
//         greenx: "red",
//       },
//     },

//     required: ["green", "yellow.greenx"],
//     rules: {
//       "yellow.greenx": (v) => {
//         return [false, "ERRROR IS " + v];
//       },
//     },
//     // ignore: ["yellow.greenx"],
//   })
// );

// Validator({
//   data: {
//     green: {
//       red: "blue",
//     },
//   },
// });
